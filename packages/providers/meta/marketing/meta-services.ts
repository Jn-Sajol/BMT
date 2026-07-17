import { IGraphClient } from "../../core/graph.interface"

export class CampaignService {
  constructor(private readonly client: IGraphClient) {}

  public async getCampaigns(): Promise<any> {
    return this.client.get("act_123/campaigns")
  }

  public async createCampaign(data: { name: string; objective: string; status?: string }): Promise<any> {
    return this.client.post("act_123/campaigns", data)
  }

  public async updateCampaign(campaignId: string, data: { name?: string; status?: string }): Promise<any> {
    return this.client.post(campaignId, data)
  }

  public async duplicateCampaign(campaignId: string): Promise<any> {
    return this.client.post(`${campaignId}/duplicate`, {})
  }
}

export class AdSetService {
  constructor(private readonly client: IGraphClient) {}

  public async getAdSets(): Promise<any> {
    return this.client.get("act_123/adsets")
  }

  public async createAdSet(data: { name: string; campaignId: string; dailyBudget: number }): Promise<any> {
    return this.client.post("act_123/adsets", data)
  }

  public async updateBudget(adSetId: string, dailyBudget: number): Promise<any> {
    return this.client.post(adSetId, { daily_budget: dailyBudget })
  }
}

export class AdService {
  constructor(private readonly client: IGraphClient) {}

  public async getAds(): Promise<any> {
    return this.client.get("act_123/ads")
  }

  public async createAd(data: { name: string; adsetId: string; creativeId: string }): Promise<any> {
    return this.client.post("act_123/ads", data)
  }

  public async updateAdStatus(adId: string, status: "ACTIVE" | "PAUSED"): Promise<any> {
    return this.client.post(adId, { status })
  }
}

export class PixelService {
  constructor(private readonly client: IGraphClient) {}
  public async getPixels(): Promise<any> {
    return this.client.get("act_123/adspixels")
  }
}

export class BusinessService {
  constructor(private readonly client: IGraphClient) {}
  public async getBusinessAccounts(): Promise<any> {
    return this.client.get("act_123/businesses")
  }
}

export class AudienceService {
  constructor(private readonly client: IGraphClient) {}
  public async getCustomAudiences(): Promise<any> {
    return this.client.get("act_123/customaudiences")
  }
}

export class CreativeService {
  constructor(private readonly client: IGraphClient) {}

  public async uploadCreative(data: { name: string; imageUrl?: string; videoUrl?: string }): Promise<any> {
    return this.client.post("act_123/adcreatives", data)
  }
}
