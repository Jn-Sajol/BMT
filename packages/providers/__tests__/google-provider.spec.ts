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

  it("should dynamically register google nodes into library registries", async () => {
    const plugin = new GoogleAdsPlugin()
    const registries = { nodes: [], providers: [] }

    await plugin.initialize()
    await plugin.register(registries)
    await plugin.start()

    expect(registries.providers).toContain("google")
    expect(registries.nodes).toContain("google-list-campaigns")

    await plugin.stop()
    await plugin.dispose()
  })
})
