import { Module } from "@nestjs/common"
import { WorkflowVersionController } from "./presentation/workflow-version.controller"
import { VersionService } from "./application/services/version.service"
import { DraftService } from "./application/services/draft.service"
import { CompareService } from "./application/services/compare.service"

@Module({
  controllers: [WorkflowVersionController],
  providers: [VersionService, DraftService, CompareService],
  exports: [VersionService, DraftService, CompareService],
})
export class WorkflowsModule {}
