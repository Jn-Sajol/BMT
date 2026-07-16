import { bootstrap } from "./bootstrap"

bootstrap().catch((err) => {
  console.error("[Fatal] Failed to bootstrap workers:", err)
  process.exit(1)
})
