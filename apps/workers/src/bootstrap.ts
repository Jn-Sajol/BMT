import { QueueWorker } from "./queue/queue-worker"
import { RedisConnectionManager } from "./queue/connection-manager"

export async function bootstrap(): Promise<void> {
  console.log("[Bootstrap] Starting BMT Automation Workers...")

  const worker = new QueueWorker()
  worker.start()

  const shutdown = async (signal: string) => {
    console.log(`[Bootstrap] Received ${signal}. Commencing graceful shutdown...`)
    
    // Stop accepting new queue jobs
    await worker.stop()

    // Close Redis connections
    await RedisConnectionManager.close()

    console.log("[Bootstrap] Shutdown complete. Exiting process.")
    process.exit(0)
  }

  process.on("SIGINT", () => shutdown("SIGINT"))
  process.on("SIGTERM", () => shutdown("SIGTERM"))
}
