import { RedisConnectionManager } from "../queue/connection-manager"

export class HealthService {
  public static async checkHealth(): Promise<{ status: string; redis: string }> {
    try {
      const redis = RedisConnectionManager.getConnection()
      const ping = await redis.ping()
      return {
        status: "UP",
        redis: ping === "PONG" ? "HEALTHY" : "UNHEALTHY",
      }
    } catch (e: any) {
      return {
        status: "DOWN",
        redis: `ERROR: ${e.message}`,
      }
    }
  }
}
