import { ProviderRegistry } from "../core/provider-registry"
import { MetaProvider } from "../meta/index"
import { CampaignService } from "../meta/marketing/meta-services"

describe("Provider SDK & Meta Client", () => {
  beforeAll(() => {
    ProviderRegistry.clear()
    ProviderRegistry.register(MetaProvider)
  })

  it("should retrieve registered providers correctly", () => {
    const provider = ProviderRegistry.get("meta-provider")
    expect(provider).toBeDefined()
    expect(provider?.name).toBe("Meta Marketing Platform")
  })

  it("should construct OAuth URL with scopes successfully", () => {
    const authUrl = MetaProvider.auth.getAuthUrl("client-123", "http://redirect.uri", ["ads_read"])
    expect(authUrl).toContain("client_id=client-123")
    expect(authUrl).toContain("scope=ads_read")
  })

  it("should resolve token exchange mock values", async () => {
    const res = await MetaProvider.auth.exchangeCode("client-123", "secret-456", "code-789", "http://redirect.uri")
    expect(res.accessToken).toBe("mock-meta-access-token-for-code-code-789")
  })

  it("should execute read-only marketing API campaigns successfully", async () => {
    const client = MetaProvider.getGraphClient("mock-meta-access-token-val")
    const campaignService = new CampaignService(client)

    const res = await campaignService.getCampaigns()
    expect(res.data.length).toBe(2)
    expect(res.data[0].id).toBe("c-1")
  })
})
