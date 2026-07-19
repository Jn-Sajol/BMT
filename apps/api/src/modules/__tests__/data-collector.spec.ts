import { ExportJobRepository } from "../data-collector/infrastructure/export-job.repository"
import { CollectedLeadRepository } from "../data-collector/infrastructure/collected-lead.repository"
import { DataExporterService } from "../data-collector/application/services/data-exporter.service"
import { LeadManagerService } from "../data-collector/application/services/lead-manager.service"
import { DataCollectorController } from "../data-collector/presentation/data-collector.controller"

describe("Fb Data Collector (F-34) Unit Tests", () => {
  it("should list collected leads, toggle favorite status, update custom research notes/tags, run CSV exports, and trace history logs", async () => {
    const jobRepo = new ExportJobRepository()
    const leadRepo = new CollectedLeadRepository()

    const exporterService = new DataExporterService(jobRepo, leadRepo)
    const managerService = new LeadManagerService(leadRepo)

    const controller = new DataCollectorController(exporterService, managerService)

    // 1. Sync collected leads
    const list = await managerService.loadMockLeads()
    expect(list.length).toBe(2)
    expect(list[0].name).toBe("Shopify Dropshipping Beginners Hub")

    // 2. Toggle Favorite
    const fav = await controller.favorite(list[0].id)
    expect(fav.isFavorite).toBe(true)

    // 3. Update notes
    const note = await controller.updateNotes(list[1].id, "Checked group approval. Fast activity.")
    expect(note.notes).toBe("Checked group approval. Fast activity.")

    // 4. Update tags
    const tagged = await controller.updateTags(list[0].id, ["dropshipping", "ecommerce", "hot"])
    expect(tagged.tags).toContain("hot")

    // 5. Trigger lead exports
    const exportJob = await controller.export("group", "CSV")
    expect(exportJob.rowCount).toBe(1)
    expect(exportJob.status).toBe("Completed")

    // 6. Dashboard metrics
    const stats = await controller.getStatistics()
    expect(stats.totalLeads).toBe(2)
    expect(stats.favoriteLeads).toBe(1)
  })
})
