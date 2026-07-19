import { Controller, Get, Post, Body, Param, NotFoundException } from "@nestjs/common"
import { FacebookGroupsSyncService } from "../application/services/facebook-groups-sync.service"
import { GroupSchedulerService } from "../application/services/group-scheduler.service"
import { GroupPublishingService } from "../application/services/group-publishing.service"

@Controller("facebook-groups")
export class FacebookGroupsController {
  constructor(
    private readonly facebookGroupsSyncService: FacebookGroupsSyncService,
    private readonly groupSchedulerService: GroupSchedulerService,
    private readonly groupPublishingService: GroupPublishingService
  ) {}

  @Post("sync")
  public async sync(@Body("accountId") accountId: string) {
    return this.facebookGroupsSyncService.syncJoinedGroups(accountId)
  }

  @Get()
  public async list() {
    return this.facebookGroupsSyncService.getGroups()
  }

  @Get(":id")
  public async getById(@Param("id") id: string) {
    const group = await this.facebookGroupsSyncService.getGroupById(id)
    if (!group) {
      throw new NotFoundException("Joined Facebook Group not found.")
    }
    return group
  }

  @Post("schedule")
  public async schedule(
    @Body("postId") postId: string,
    @Body("groupIds") groupIds: string[],
    @Body("scheduledAt") scheduledAt: string,
    @Body("delayMinutes") delayMinutes: 5 | 8 | 10 | 15
  ) {
    return this.groupSchedulerService.schedulePostToGroups(postId, groupIds, new Date(scheduledAt), delayMinutes)
  }

  @Post("posts/:id/cancel")
  public async cancel(@Param("id") id: string) {
    await this.groupSchedulerService.cancelSchedule(id)
    return { success: true }
  }

  @Get("queue")
  public async getQueue() {
    return this.groupSchedulerService.getQueue()
  }

  @Get("reports")
  public async getReports() {
    return this.groupPublishingService.getReports()
  }
}
