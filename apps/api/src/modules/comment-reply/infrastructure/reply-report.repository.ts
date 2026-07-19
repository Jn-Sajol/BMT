import { Injectable } from "@nestjs/common"
import { ReplyReport } from "../domain/reply-report.model"

@Injectable()
export class ReplyReportRepository {
  private reports: ReplyReport[] = []

  public async save(report: ReplyReport): Promise<ReplyReport> {
    this.reports.push(report)
    return report
  }

  public async findAll(): Promise<ReplyReport[]> {
    return this.reports
  }
}
