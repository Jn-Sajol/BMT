import { Injectable } from "@nestjs/common"
import { ReportRepository } from "../../infrastructure/report.repository"
import { PublishLog } from "../../domain/publish-log.model"

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  public async getReports(): Promise<PublishLog[]> {
    return this.reportRepository.findAll()
  }
}
