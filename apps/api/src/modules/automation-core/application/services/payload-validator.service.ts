import { Injectable, BadRequestException } from "@nestjs/common"
import { AutomationJob } from "../../domain/automation-core.model"
import { AutomationContext } from "../../domain/automation-framework.model"
import { AutomationCapability } from "../../domain/automation-plugin.model"
import { AutomationRegistryService } from "./automation-registry.service"
import { FeatureFlagService } from "./feature-flag.service"
import { PolicyService } from "./policy.service"

@Injectable()
export class PayloadValidatorService {
  constructor(
    private readonly registryService: AutomationRegistryService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly policyService: PolicyService
  ) {}

  public async validateJobPayload(
    job: AutomationJob,
    context: AutomationContext,
    platform: string,
    capability: AutomationCapability
  ): Promise<{ valid: boolean; reason?: string }> {
    // 1. Required fields validation
    if (!job.id || !job.workspaceId || !job.jobType) {
      throw new BadRequestException("Job payload missing required parameters (id, workspaceId, jobType).")
    }

    // 2. Feature Flag validation
    const flagsAllowed = await this.featureFlagService.isEnabled("system.advanced_automation", job.workspaceId)
    if (!flagsAllowed) {
      return { valid: false, reason: "Feature flag system.advanced_automation is disabled for workspace." }
    }

    // 3. Workspace Policy validation
    const policyResult = await this.policyService.validatePolicy(platform, job.jobType, context.accountHealthScore)
    if (!policyResult.allowed) {
      return { valid: false, reason: policyResult.reason }
    }

    // 4. Plugin Capability resolution check
    const plugin = this.registryService.getPluginByCapability(platform, capability)
    if (!plugin) {
      return { valid: false, reason: `No enabled plugin found supporting capability ${capability} for platform ${platform}.` }
    }

    // 5. Platform Driver validation
    const driver = this.registryService.getDriver(platform)
    if (!driver) {
      return { valid: false, reason: `No registered platform driver for platform ${platform}.` }
    }

    const authValid = await driver.validatePlatformAuth(context.accountId)
    if (!authValid) {
      return { valid: false, reason: `Platform driver authentication failed for account ${context.accountId}.` }
    }

    return { valid: true }
  }
}
