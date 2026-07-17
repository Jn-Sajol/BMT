import { PluginRegistry, PluginLoader, IPlugin } from "plugin-sdk"
import { PluginManagerService } from "../application/services/plugin-manager.service"

describe("Enterprise Plugin SDK & Marketplace Engine", () => {
  let manager: PluginManagerService

  beforeEach(() => {
    PluginRegistry.clear()
    manager = new PluginManagerService()
  })

  it("should block plugin installation if platform version requires updates", async () => {
    const res = await manager.installPlugin({
      id: "incompatible-plugin",
      name: "High Version Plugin",
      version: "2.0.0",
      author: "Test",
      description: "Requires future BMT",
      category: "Test",
      minPlatformVersion: "2.5",
      supportedPlatformVersion: "2.5",
      license: "MIT",
      permissions: [],
      dependencies: [],
    })

    expect(res.success).toBe(false)
    expect(res.message).toContain("Version mismatch")
  })

  it("should safely initialize, register and start valid plugin layouts", async () => {
    const res = await manager.installPlugin({
      id: "valid-plugin",
      name: "Valid Plugin",
      version: "1.0.0",
      author: "Test",
      description: "Runs fine",
      category: "Test",
      minPlatformVersion: "1.0",
      supportedPlatformVersion: "1.0",
      license: "MIT",
      permissions: ["network"],
      dependencies: [],
    })

    expect(res.success).toBe(true)
    expect(PluginRegistry.list().length).toBe(1)
  })

  it("should isolate lifecycle runtime execution issues and prevent system crashes", async () => {
    const brokenPlugin: IPlugin = {
      manifest: {
        id: "broken-plugin",
        name: "Broken Plugin",
        version: "1.0.0",
        author: "Test",
        description: "Throws on load",
        category: "Test",
        minPlatformVersion: "1.0",
        supportedPlatformVersion: "1.0",
        license: "MIT",
        permissions: [],
        dependencies: [],
      },
      initialize: async () => {
        throw new Error("Crash during initialization")
      },
      register: async () => {},
      start: async () => {},
      stop: async () => {},
      dispose: async () => {},
    }

    const loaded = await PluginLoader.loadPlugin(brokenPlugin, {})
    expect(loaded).toBe(false) // Trapped gracefully, no system crash
  })
})
