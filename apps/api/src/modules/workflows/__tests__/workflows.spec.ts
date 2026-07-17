import { DraftService } from "../application/services/draft.service"
import { VersionService } from "../application/services/version.service"
import { CompareService } from "../application/services/compare.service"

describe("Workflow Versioning & Draft Management", () => {
  let draftService: DraftService
  let versionService: VersionService
  let compareService: CompareService

  beforeEach(() => {
    draftService = new DraftService()
    versionService = new VersionService(draftService)
    compareService = new CompareService()
  })

  it("should autosave a draft and maintain draft state independently", () => {
    const draft = draftService.autosaveDraft(
      "wf-1",
      [{ id: "node-1", type: "trigger", properties: { x: 10 } }],
      [],
      {},
      "user-100"
    )

    expect(draft.workflowId).toBe("wf-1")
    expect(draft.nodes.length).toBe(1)
    expect(draft.nodes[0].properties.x).toBe(10)
  })

  it("should publish drafts creating immutable versions with sha256 content hashes", () => {
    draftService.autosaveDraft(
      "wf-1",
      [{ id: "node-1", type: "trigger", properties: {} }],
      [],
      {},
      "user-100"
    )

    const ver = versionService.publishDraft("wf-1", "user-100", "Initial Release")
    expect(ver.versionNumber).toBe(1)
    expect(ver.changeSummary).toBe("Initial Release")
    expect(ver.contentHash).toBeDefined()
    expect(ver.contentHash.length).toBe(64) // SHA-256 length

    // Draft is cleared upon publishing
    expect(draftService.getDraft("wf-1")).toBeNull()
  })

  it("should rollback creating a new version copying from historical target", () => {
    // 1. Publish v1
    draftService.autosaveDraft("wf-1", [{ id: "node-1", type: "trigger" }], [], {}, "user-100")
    versionService.publishDraft("wf-1", "user-100", "v1 release")

    // 2. Publish v2
    draftService.autosaveDraft("wf-1", [{ id: "node-2", type: "trigger" }], [], {}, "user-100")
    versionService.publishDraft("wf-1", "user-100", "v2 release")

    // 3. Rollback to v1 (creates v3 copying v1)
    const ver3 = versionService.rollbackToVersion("wf-1", 1, "user-100")
    expect(ver3.versionNumber).toBe(3)
    expect(ver3.rollbackSourceVersionNumber).toBe(1)
    expect(ver3.nodes[0].id).toBe("node-1") // Copied v1 content
  })

  it("should diff node additions/removals and modifications in CompareService", () => {
    const v1 = {
      nodes: [{ id: "node-1", properties: { a: 1 } }],
    }
    const v2 = {
      nodes: [
        { id: "node-1", properties: { a: 2 } }, // property change
        { id: "node-2", properties: {} },      // node addition
      ],
    }

    const diff = compareService.compare(v1, v2)
    expect(diff.nodesAdded).toContain("node-2")
    expect(diff.propertyChanges).toContain("node:node-1:properties")
  })
})
