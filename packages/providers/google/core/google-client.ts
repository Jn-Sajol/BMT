export class GoogleAdsClient {
  constructor(private readonly accessToken: string) {}

  public async listCustomers(): Promise<string[]> {
    console.log("[GoogleAdsClient] Listing Customer Accounts...")
    return ["cust-100", "cust-200"]
  }

  public async listCampaigns(customerId: string): Promise<any[]> {
    console.log(`[GoogleAdsClient] Fetching campaigns for customer: ${customerId}`)
    return [
      { id: "camp-g-1", name: "Google Search Promo", status: "ENABLED", budget: 5000 },
      { id: "camp-g-2", name: "Google Display Remarketing", status: "PAUSED", budget: 3000 },
    ]
  }

  public async listAdGroups(customerId: string, campaignId: string): Promise<any[]> {
    console.log(`[GoogleAdsClient] Listing Ad Groups for campaign: ${campaignId}`)
    return [
      { id: "adgroup-g-1", name: "AdGroup Alpha", status: "ENABLED" },
    ]
  }

  public async listAds(customerId: string, adGroupId: string): Promise<any[]> {
    console.log(`[GoogleAdsClient] Listing Ads for ad group: ${adGroupId}`)
    return [
      { id: "ad-g-1", headline: "Unlock Premium BMT features!", status: "ENABLED" },
    ]
  }

  public async getCampaignMetrics(customerId: string, campaignId: string): Promise<any> {
    console.log(`[GoogleAdsClient] Getting metrics for campaign: ${campaignId}`)
    return {
      impressions: 45000,
      clicks: 1200,
      conversions: 85,
      cost: 450.5,
    }
  }
}
