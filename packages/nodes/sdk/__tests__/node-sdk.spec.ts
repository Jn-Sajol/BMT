import { z } from "zod"
import { NodeRegistry } from "../node-registry"
import { BaseNode } from "../base-node"
import { NodeDefinition } from "../node-definition"

describe("Node SDK & Registry", () => {
  const mockNodeDef: NodeDefinition = {
    id: "test-node",
    name: "Test Node",
    provider: "MockProvider",
    category: "ACTION",
    version: "1.0.0",
    minEngineVersion: "1.0.0",
    propertiesSchema: z.object({
      url: z.string().url("Must be a valid URL."),
      secretRef: z.object({ credentialId: z.string() }),
    }),
    uiMetadata: {
      url: { label: "Target URL", type: "text" },
      secretRef: { label: "Credential Reference", type: "secret" },
    },
  }

  beforeEach(() => {
    NodeRegistry.clear()
  })

  it("should successfully register and retrieve a node definition", () => {
    NodeRegistry.register(mockNodeDef)
    const retrieved = NodeRegistry.get("test-node")
    expect(retrieved).toBeDefined()
    expect(retrieved?.name).toBe("Test Node")
  })

  it("should validate valid and invalid property payloads correctly", () => {
    const node = new BaseNode(mockNodeDef)
    
    // Invalid url validation check
    node.properties = { url: "invalid-url", secretRef: { credentialId: "cred-1" } }
    let check = node.validate()
    expect(check.success).toBe(false)
    expect(check.errors.url).toBeDefined()

    // Valid url validation check
    node.properties = { url: "https://google.com", secretRef: { credentialId: "cred-1" } }
    check = node.validate()
    expect(check.success).toBe(true)
  })

  it("should extract credential identifiers correctly", () => {
    const node = new BaseNode(mockNodeDef, {
      url: "https://google.com",
      secretRef: { credentialId: "vault-secret-123" },
    })

    const credId = node.getCredentialReference("secretRef")
    expect(credId).toBe("vault-secret-123")
  })
})
