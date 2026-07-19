import { Injectable } from "@nestjs/common"
import { CommentReportRepository } from "../../infrastructure/comment-report.repository"
import { CommentCampaignSummaryReport } from "../../domain/comment-report.model"

@Injectable()
export class CommentReportService {
  constructor(private readonly commentReportRepository: CommentReportRepository) {}

  public async getReports(): Promise<CommentCampaignSummaryReport[]> {
    return this.commentReportRepository.findAll()
  }

  public async generateSummaryReport(
    campaignId: string,
    campaignTitle: string,
    status: string,
    templateCount: number,
    targetCount: number
  ): Promise<CommentCampaignSummaryReport> {
    const report: CommentCampaignSummaryReport = {
      id: `crep-${Date.now()}`,
      campaignId,
      campaignTitle,
      status,
      templateCount,
      targetCount,
      createdTime: new Date(),
      updatedTime: new Date(),
      commentsPostedCount: 0,
    }
    return this.commentReportRepository.save(report)
  }
}
