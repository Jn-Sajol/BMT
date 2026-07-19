import { Injectable } from "@nestjs/common"
import { CampaignReport } from "../domain/messenger-group-report.model"

@Injectable()
export class CampaignReportRepository {
  private reports: CampaignReport[] = []

  public async save(report: CampaignReport): Promise<CampaignReport> {
    this.reports.push(report)
    return report
  }

  public async findAll(): Promise<CampaignReport[]> {
    return this.reports
  }
}
