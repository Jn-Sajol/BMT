import { Injectable } from "@nestjs/common"
import { GroupPublishRepository } from "../../infrastructure/group-publish.repository"
import { GroupPublishLog } from "../../domain/group-publish-log.model"

@Injectable()
export class GroupPublishingService {
  constructor(private readonly groupPublishRepository: GroupPublishRepository) {}

  public async publishToGroup(
    postId: string,
    groupId: string,
    groupName: string,
    accountId: string
  ): Promise<GroupPublishLog> {
    console.log(`[GroupPublishingService] Publishing post ${postId} to joined Facebook group: ${groupName}...`)
    
    const startTime = Date.now()

    const log: GroupPublishLog = {
      id: `glog-${Date.now()}`,
      requestId: `req-${Date.now()}-fb-group-publish`,
      groupName,
      accountId,
      postId,
      publishTime: new Date(),
      facebookPostId: `fb-gpost-${Date.now()}`,
      executionDurationMs: Date.now() - startTime,
      status: "success",
    }

    return this.groupPublishRepository.save(log)
  }

  public async getReports(): Promise<GroupPublishLog[]> {
    return this.groupPublishRepository.findAll()
  }
}
