import { IGraphClient } from "../../core/graph.interface"

export class CampaignService {
  constructor(private readonly client: IGraphClient) {}
  public async getCampaigns(): Promise<any> {
    return this.client.get("act_123/campaigns")
  }
}

export class AdSetService {
  constructor(private readonly client: IGraphClient) {}
  public async getAdSets(): Promise<any> {
    return this.client.get("act_123/adsets")
  }
}

export class AdService {
  constructor(private readonly client: IGraphClient) {}
  public async getAds(): Promise<any> {
    return this.client.get("act_123/ads")
  }
}

export class InsightService {
  constructor(private readonly client: IGraphClient) {}
  public async getInsights(): Promise<any> {
    return this.client.get("act_123/insights")
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
