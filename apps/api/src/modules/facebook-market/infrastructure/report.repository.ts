import { Injectable } from "@nestjs/common"
import { PublishLog } from "../domain/publish-log.model"

@Injectable()
export class ReportRepository {
  private logs: PublishLog[] = []

  public async save(log: PublishLog): Promise<PublishLog> {
    this.logs.push(log)
    return log
  }

  public async findAll(): Promise<PublishLog[]> {
    return this.logs
  }
}
