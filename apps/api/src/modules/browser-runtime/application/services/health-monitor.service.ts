import { Injectable } from "@nestjs/common"
import { BrowserInstance } from "./browser-pool.service"

export interface HealthMetricReport {
  instanceId: string
  status: string
  memoryUsageMb: number
  cpuPercentage: number
  isExceededLimits: boolean
  recommendation: "KeepRunning" | "RestartRequired" | "ForceKill"
}

@Injectable()
export class HealthMonitorService {
  public async inspectInstance(instance: BrowserInstance): Promise<HealthMetricReport> {
    const memoryLimit = 400 // 400MB threshold
    const isExceeded = instance.memoryUsageMb > memoryLimit
    const recommendation = instance.status === "Crashed"
      ? "RestartRequired"
      : isExceeded
      ? "RestartRequired"
      : "KeepRunning"

    return {
      instanceId: instance.id,
      status: instance.status,
      memoryUsageMb: instance.memoryUsageMb,
      cpuPercentage: instance.cpuPercentage,
      isExceededLimits: isExceeded,
      recommendation,
    }
  }
}
