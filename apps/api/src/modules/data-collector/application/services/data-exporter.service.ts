import { Injectable } from "@nestjs/common"
import { ExportJobRepository } from "../../infrastructure/export-job.repository"
import { CollectedLeadRepository } from "../../infrastructure/collected-lead.repository"
import { SafeCsvExtractorStrategy } from "../../domain/data-collector-strategy.interface"
import { ExportJob, ExportFormat } from "../../domain/data-collector.model"

@Injectable()
export class DataExporterService {
  constructor(
    private readonly exportJobRepository: ExportJobRepository,
    private readonly collectedLeadRepository: CollectedLeadRepository
  ) {}

  public async getExportJobs(): Promise<ExportJob[]> {
    return this.exportJobRepository.findAll()
  }

  public async triggerExport(type: "group" | "link", format: ExportFormat, creator: string): Promise<ExportJob> {
    const leads = await this.collectedLeadRepository.findAll()
    const targetLeads = leads.filter(l => l.type === type)

    const strategy = new SafeCsvExtractorStrategy()
    const content = await strategy.exportLeads(targetLeads)
    console.log(`[DataExporterService] Export contents created: \n${content.substring(0, 100)}...`)

    const job: ExportJob = {
      id: `job-${Date.now()}`,
      type,
      format,
      status: "Completed",
      rowCount: targetLeads.length,
      fileUrl: `https://bmt-cdn-mock.s3.amazonaws.com/exports/export-${Date.now()}.${format === "CSV" ? "csv" : "xlsx"}`,
      createdBy: creator,
      createdAt: new Date(),
    }

    return this.exportJobRepository.save(job)
  }
}
