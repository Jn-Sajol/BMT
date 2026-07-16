import Redis from "ioredis"

export class RedisConnectionManager {
  private static instance: Redis | null = null

  public static getConnection(): Redis {
    if (!RedisConnectionManager.instance) {
      const host = process.env.REDIS_HOST || "localhost"
      const port = parseInt(process.env.REDIS_PORT || "6379", 10)
      const password = process.env.REDIS_PASSWORD || undefined

      RedisConnectionManager.instance = new Redis({
        host,
        port,
        password,
        maxRetriesPerRequest: null, // Required by BullMQ
        retryStrategy(times) {
          console.warn(`[Redis] Reconnecting attempt ${times}...`)
          return Math.min(times * 100, 3000)
        },
      })

      RedisConnectionManager.instance.on("connect", () => {
        console.log("[Redis] Connection established successfully.")
      })

      RedisConnectionManager.instance.on("error", (err) => {
        console.error("[Redis] Connection error:", err.message)
      })
    }
    return RedisConnectionManager.instance
  }

  public static async close(): Promise<void> {
    if (RedisConnectionManager.instance) {
      console.log("[Redis] Disconnecting client pool...")
      await RedisConnectionManager.instance.quit()
      RedisConnectionManager.instance = null
    }
  }
}
