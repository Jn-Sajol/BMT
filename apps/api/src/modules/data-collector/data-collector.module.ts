import { Module } from "@nestjs/common"
import { DataCollectorController } from "./presentation/data-collector.controller"
import { DataExporterService } from "./application/services/data-exporter.service"
import { LeadManagerService } from "./application/services/lead-manager.service"
import { ExportJobRepository } from "./infrastructure/export-job.repository"
import { CollectedLeadRepository } from "./infrastructure/collected-lead.repository"

@Module({
  controllers: [DataCollectorController],
  providers: [
    DataExporterService,
    LeadManagerService,
    ExportJobRepository,
    CollectedLeadRepository,
  ],
  exports: [
    DataExporterService,
    LeadManagerService,
    ExportJobRepository,
    CollectedLeadRepository,
  ],
})
export class DataCollectorModule {}
