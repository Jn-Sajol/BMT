import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from "@nestjs/common"
import { VersionService } from "../application/services/version.service"
import { DraftService } from "../application/services/draft.service"
import { CompareService } from "../application/services/compare.service"

@Controller("workflows")
export class WorkflowVersionController {
  constructor(
    private readonly versionService: VersionService,
    private readonly draftService: DraftService,
    private readonly compareService: CompareService
  ) {}

  @Get(":id/versions")
  listVersions(@Param("id") workflowId: string) {
    return this.versionService.listVersions(workflowId)
  }

  @Get(":id/draft")
  getDraft(@Param("id") workflowId: string) {
    return this.draftService.getDraft(workflowId)
  }

  @Post(":id/autosave")
  @HttpCode(HttpStatus.OK)
  autosave(
    @Param("id") workflowId: string,
    @Body("nodes") nodes: any[],
    @Body("edges") edges: any[],
    @Body("variables") variables: Record<string, any>,
    @Body("userId") userId: string
  ) {
    return this.draftService.autosaveDraft(workflowId, nodes, edges, variables, userId)
  }

  @Post(":id/publish")
  publish(
    @Param("id") workflowId: string,
    @Body("userId") userId: string,
    @Body("changeSummary") changeSummary: string
  ) {
    return this.versionService.publishDraft(workflowId, userId, changeSummary)
  }

  @Post(":id/rollback")
  rollback(
    @Param("id") workflowId: string,
    @Body("targetVersionNumber") targetVersionNumber: number,
    @Body("userId") userId: string
  ) {
    return this.versionService.rollbackToVersion(workflowId, targetVersionNumber, userId)
  }

  @Get(":id/compare")
  compare(
    @Param("id") workflowId: string,
    @Query("v1") v1Number: string,
    @Query("v2") v2Number: string
  ) {
    const list = this.versionService.listVersions(workflowId)
    const v1 = list.find((v) => v.versionNumber === parseInt(v1Number, 10))
    const v2 = list.find((v) => v.versionNumber === parseInt(v2Number, 10))

    if (!v1 || !v2) {
      return { error: "One of the versions is missing." }
    }

    return this.compareService.compare(v1, v2)
  }
}
