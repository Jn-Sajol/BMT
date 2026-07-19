import { Injectable } from "@nestjs/common"
import { GroupPublishLog } from "../domain/group-publish-log.model"

@Injectable()
export class GroupPublishRepository {
  private logs: GroupPublishLog[] = []

  public async save(log: GroupPublishLog): Promise<GroupPublishLog> {
    this.logs.push(log)
    return log
  }

  public async findAll(): Promise<GroupPublishLog[]> {
    return this.logs
  }
}
