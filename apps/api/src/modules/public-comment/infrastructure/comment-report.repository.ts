import { Injectable } from "@nestjs/common"
import { CommentCampaignSummaryReport } from "../domain/comment-report.model"

@Injectable()
export class CommentReportRepository {
  private reports: CommentCampaignSummaryReport[] = []

  public async save(report: CommentCampaignSummaryReport): Promise<CommentCampaignSummaryReport> {
    this.reports.push(report)
    return report
  }

  public async findAll(): Promise<CommentCampaignSummaryReport[]> {
    return this.reports
  }
}
