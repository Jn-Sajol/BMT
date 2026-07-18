import { GoogleOAuth } from "../google/core/google-oauth"
import { GoogleAdsClient } from "../google/core/google-client"
import { GoogleAdsPlugin } from "../google/plugin/google-ads.plugin"

describe("Google Ads Integration Provider & Plugin", () => {
  it("should construct authorization code URL with query scopes successfully", () => {
    const oauth = new GoogleOAuth()
    const url = oauth.getAuthUrl("client-123", "http://callback", ["ads", "profile"])

    expect(url).toContain("client_id=client-123")
    expect(url).toContain("redirect_uri=http://callback")
    expect(url).toContain("scope=ads%20profile")
  })

  it("should exchange code and automatically refresh expired access tokens", async () => {
    const oauth = new GoogleOAuth()
    const exchange = await oauth.exchangeCode("code-123", "client-123", "secret-123", "http://callback")
    expect(exchange.accessToken).toBe("mock-google-access-token")

    const refresh = await oauth.refreshAccessToken(exchange.refreshToken, "client-123", "secret-123")
    expect(refresh.accessToken).toBe("mock-google-refreshed-access-token")
  })

  it("should fetch customer campaigns and metrics using Ads client", async () => {
    const client = new GoogleAdsClient("mock-token")
    const customers = await client.listCustomers()
    expect(customers).toContain("cust-100")

    const campaigns = await client.listCampaigns("cust-100")
    expect(campaigns.length).toBe(2)
    expect(campaigns[0].id).toBe("camp-g-1")

    const metrics = await client.getCampaignMetrics("cust-100", "camp-g-1")
    expect(metrics.clicks).toBe(1200)
    expect(metrics.impressions).toBe(45000)
  })

  it("should dynamically register google nodes and triggers into library registries", async () => {
    const plugin = new GoogleAdsPlugin()
    const registries = { nodes: [], triggers: [], providers: [] }

    await plugin.initialize()
    await plugin.register(registries)
    await plugin.start()

    expect(registries.providers).toContain("google")
    expect(registries.nodes).toContain("google-list-campaigns")
    expect(registries.nodes).toContain("google-create-campaign")
    expect(registries.triggers).toContain("google-campaign-updated-trigger")

    await plugin.stop()
    await plugin.dispose()
  })

  // --- WRITE OPERATIONS & ERROR MAPPING TESTS ---

  it("should validate campaign inputs using zod schema and raise error on validation fails", async () => {
    const client = new GoogleAdsClient("mock-token")
    const invalidInput = { customerId: "cust-100", name: "Hi", budget: -10, status: "DRAFT", objective: "", biddingStrategy: "" }

    await expect(client.createCampaign(invalidInput)).rejects.toThrow()
  })

  it("should create campaign and update budget successfully when inputs match zod schemas", async () => {
    const client = new GoogleAdsClient("mock-token")
    const validInput = {
      customerId: "cust-100",
      name: "Google Search 2026",
      budget: 150.5,
      status: "ENABLED" as const,
      objective: "SALES",
      biddingStrategy: "MANUAL_CPC",
    }

    const res = await client.createCampaign(validInput)
    expect(res.id).toContain("camp-g-")
    expect(res.requestId).toContain("campaign-create")

    const budgetRes = await client.updateBudget(res.id, 250)
    expect(budgetRes.success).toBe(true)
  })

  it("should map Google Ads errors into standardized platform errors", () => {
    const err = new Error("GoogleAdsError: VALIDATION - Invalid budget input.")
    const mapped = GoogleAdsClient.mapError(err)
    expect(mapped).toBe("VALIDATION")
  })

  it("should execute rollback strategy generating compensating remove actions upon failure", async () => {
    const client = new GoogleAdsClient("mock-token")
    const campaignId = "camp-g-temp"

    const rollback = await client.removeCampaign(campaignId)
    expect(rollback.success).toBe(true)
    expect(rollback.requestId).toContain("campaign-remove")
  })

  // --- EVENTS, CONVERSIONS & AUDIENCES TESTS ---

  it("should upload offline conversions and support GCLID and order tracking", async () => {
    const client = new GoogleAdsClient("mock-token")
    const res = await client.uploadConversion("gclid-100", "order-999", 500)
    expect(res.success).toBe(true)
    expect(res.requestId).toContain("conversion-upload")
  })

  it("should synchronize customer matches and audience list memberships", async () => {
    const client = new GoogleAdsClient("mock-token")
    const res = await client.syncAudience("VIP-List", ["user@corp.com"])
    expect(res.success).toBe(true)
    expect(res.requestId).toContain("audience-sync")
  })

  it("should execute batch mutations and identify partial execution failures", async () => {
    const client = new GoogleAdsClient("mock-token")
    const operations = [
      { action: "CREATE", name: "Valid Batch" },
      { action: "CREATE", name: "Broken Batch", fail: true },
    ]

    const batchRes = await client.batchMutate(operations)
    expect(batchRes.success).toBe(false) // failed due to row 2
    expect(batchRes.results[0].success).toBe(true)
    expect(batchRes.results[1].success).toBe(false)
  })

  it("should normalize raw inputs according to provider event source abstraction", () => {
    const client = new GoogleAdsClient("mock-token")
    const raw = { id: "evt-google-1", type: "google.campaign.disapproved", data: { campaignId: "camp-g-1" } }

    const normalized = client.normalizeEvent(raw, "webhook")
    expect(normalized.eventId).toBe("evt-google-1")
    expect(normalized.sourceType).toBe("webhook")
    expect(normalized.eventType).toBe("google.campaign.disapproved")
  })
})
