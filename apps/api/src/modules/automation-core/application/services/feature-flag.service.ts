import { Injectable } from "@nestjs/common"

@Injectable()
export class FeatureFlagService {
  private flags = new Map<string, boolean>()

  constructor() {
    // Default system mode config flags
    this.flags.set("system.advanced_automation", true)
    this.flags.set("system.canary_release", false)
  }

  public async isEnabled(flagKey: string, workspaceId: string): Promise<boolean> {
    const val = this.flags.get(flagKey)
    return val !== undefined ? val : false
  }

  public setFlag(flagKey: string, value: boolean): void {
    this.flags.set(flagKey, value)
  }
}
