import { Injectable } from "@nestjs/common"
import { CampaignReportRepository } from "../../infrastructure/campaign-report.repository"
import { CampaignReport } from "../../domain/messenger-group-report.model"

@Injectable()
export class MessengerGroupReportService {
  constructor(private readonly campaignReportRepository: CampaignReportRepository) {}

  public async getReports(): Promise<CampaignReport[]> {
    return this.campaignReportRepository.findAll()
  }

  public async logReport(campaignId: string, title: string, groupsCount: number, status: string): Promise<CampaignReport> {
    const report: CampaignReport = {
      id: `crep-${Date.now()}`,
      campaignId,
      campaignTitle: title,
      groupsCount,
      deliveryCount: groupsCount,
      failureCount: 0,
      sentTime: new Date(),
      status,
    }
    return this.campaignReportRepository.save(report)
  }
}
