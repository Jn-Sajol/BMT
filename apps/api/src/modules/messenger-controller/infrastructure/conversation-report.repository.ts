import { Injectable } from "@nestjs/common"
import { ConversationReport } from "../domain/conversation-report.model"

@Injectable()
export class ConversationReportRepository {
  private reports: ConversationReport[] = []

  public async save(report: ConversationReport): Promise<ConversationReport> {
    this.reports.push(report)
    return report
  }

  public async findAll(): Promise<ConversationReport[]> {
    return this.reports
  }
}
