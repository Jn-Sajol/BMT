import { PluginManifestSchema } from "../core/plugin-manifest"
import { PluginRegistry } from "../core/plugin-registry"

describe("Plugin SDK Manifest Zod Checks", () => {
  beforeEach(() => {
    PluginRegistry.clear()
  })

  it("should parse manifests conforming to the strict schemas", () => {
    const data = {
      id: "slack-id",
      name: "Slack Notify",
      version: "1.0.0",
      author: "Corp",
      description: "Notify channels",
      category: "Utility",
      minPlatformVersion: "1.0",
      supportedPlatformVersion: "1.0",
      license: "MIT",
      permissions: ["network", "notifications"],
      dependencies: [],
    }

    const parsed = PluginManifestSchema.parse(data)
    expect(parsed.id).toBe("slack-id")
    expect(parsed.permissions).toContain("network")
  })

  it("should reject manifest blocks containing unauthorized permissions keys", () => {
    const data = {
      id: "slack-id",
      name: "Slack Notify",
      version: "1.0.0",
      author: "Corp",
      description: "Notify channels",
      category: "Utility",
      minPlatformVersion: "1.0",
      supportedPlatformVersion: "1.0",
      license: "MIT",
      permissions: ["unauthorized_perm"],
      dependencies: [],
    }

    expect(() => {
      PluginManifestSchema.parse(data)
    }).toThrow()
  })
})
