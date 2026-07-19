import { Controller, Get, Post, Body, Query } from "@nestjs/common"
import { DataExporterService } from "../application/services/data-exporter.service"
import { LeadManagerService } from "../application/services/lead-manager.service"
import { ExportFormat } from "../domain/data-collector.model"

@Controller("data-collector")
export class DataCollectorController {
  constructor(
    private readonly dataExporterService: DataExporterService,
    private readonly leadManagerService: LeadManagerService
  ) {}

  @Get("dashboard")
  public async getDashboard() {
    const list = await this.leadManagerService.getLeads()
    const jobs = await this.dataExporterService.getExportJobs()
    return {
      totalLeads: list.length,
      groupLeads: list.filter((l) => l.type === "group").length,
      linkLeads: list.filter((l) => l.type === "link").length,
      favoriteLeads: list.filter((l) => l.isFavorite).length,
      totalExports: jobs.length,
    }
  }

  @Get("leads")
  public async getLeads() {
    return this.leadManagerService.getLeads()
  }

  @Post("leads/save")
  public async saveLead(@Body("lead") lead: any) {
    return this.leadManagerService.saveLead(lead)
  }

  @Post("leads/favorite")
  public async favorite(@Body("id") id: string) {
    return this.leadManagerService.toggleFavorite(id)
  }

  @Post("leads/notes")
  public async updateNotes(@Body("id") id: string, @Body("notes") notes: string) {
    return this.leadManagerService.updateNotes(id, notes)
  }

  @Post("leads/tags")
  public async updateTags(@Body("id") id: string, @Body("tags") tags: string[]) {
    return this.leadManagerService.updateTags(id, tags)
  }

  @Get("exports")
  public async getExports() {
    return this.dataExporterService.getExportJobs()
  }

  @Post("export")
  public async export(
    @Body("type") type: "group" | "link",
    @Body("format") format: ExportFormat
  ) {
    return this.dataExporterService.triggerExport(type, format, "exporter-1")
  }

  @Get("history")
  public async getHistory() {
    const jobs = await this.dataExporterService.getExportJobs()
    return jobs.map((j) => ({
      id: j.id,
      action: `Exported ${j.rowCount} ${j.type} leads as ${j.format}`,
      timestamp: j.createdAt,
    }))
  }

  @Get("reports")
  public async getReports() {
    const list = await this.leadManagerService.getLeads()
    const jobs = await this.dataExporterService.getExportJobs()
    return [
      {
        id: "drep-1",
        totalExports: jobs.length,
        totalCollectedLeads: list.length,
        exportsByType: { CSV: jobs.filter((j) => j.format === "CSV").length },
        leadsByType: { Group: list.filter((l) => l.type === "group").length },
      },
    ]
  }

  @Get("statistics")
  public async getStatistics() {
    const list = await this.leadManagerService.getLeads()
    return {
      totalLeads: list.length,
      groupLeads: list.filter((l) => l.type === "group").length,
      linkLeads: list.filter((l) => l.type === "link").length,
      favoriteLeads: list.filter((l) => l.isFavorite).length,
    }
  }
}
