import { Injectable } from "@nestjs/common"

@Injectable()
export class DashboardStatsRepository {
  // Config parameters for dashboard layout
  public async getDashboardConfig(): Promise<Record<string, any>> {
    return { layout: "default", refreshIntervalMs: 30000 }
  }
}
