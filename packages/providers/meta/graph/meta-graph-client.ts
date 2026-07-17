import { IGraphClient, GraphRequestOptions } from "../../core/graph.interface"

export class MetaGraphClient implements IGraphClient {
  constructor(private readonly accessToken: string) {}

  public async get<T = any>(path: string, options?: GraphRequestOptions): Promise<T> {
    return this.executeWithRetry(async () => {
      // Simulate endpoint mapping
      if (path.includes("campaigns")) {
        return {
          data: [
            { id: "c-1", name: "Meta Lead Gen Q3", status: "ACTIVE" },
            { id: "c-2", name: "Meta Conversion Q4", status: "PAUSED" },
          ],
          paging: { next: "https://graph.facebook.com/v20.0/act_123/campaigns?after=cursor-next" },
        } as any as T
      }

      if (path.includes("insights")) {
        return {
          data: [
            { campaign_id: "c-1", spend: 450.0, clicks: 120, impressions: 4500 },
          ],
        } as any as T
      }

      return { success: true } as any as T
    })
  }

  public async post<T = any>(path: string, data?: any, options?: GraphRequestOptions): Promise<T> {
    return this.executeWithRetry(async () => {
      return { success: true } as any as T
    })
  }

  private async executeWithRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 100): Promise<T> {
    let attempt = 0
    while (attempt < retries) {
      try {
        return await fn()
      } catch (e) {
        attempt++
        if (attempt >= retries) throw e
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }
    throw new Error("Meta API request failed after maximum retries.")
  }
}
