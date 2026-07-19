import { FacebookGroupRepository } from "../facebook-groups/infrastructure/facebook-group.repository"
import { FacebookGroupsSyncService } from "../facebook-groups/application/services/facebook-groups-sync.service"
import { GroupScheduleRepository } from "../facebook-groups/infrastructure/group-schedule.repository"
import { GroupSchedulerService } from "../facebook-groups/application/services/group-scheduler.service"
import { GroupPublishRepository } from "../facebook-groups/infrastructure/group-publish.repository"
import { GroupPublishingService } from "../facebook-groups/application/services/group-publishing.service"
import { FacebookGroupsController } from "../facebook-groups/presentation/facebook-groups.controller"

describe("Facebook Groups (F-25) Unit Tests", () => {
  it("should sync joined groups, list groups, schedule group post with delay, and check reports", async () => {
    const groupRepo = new FacebookGroupRepository()
    const schedRepo = new GroupScheduleRepository()
    const reportRepo = new GroupPublishRepository()

    const syncService = new FacebookGroupsSyncService(groupRepo)
    const schedulerService = new GroupSchedulerService(schedRepo)
    const publishingService = new GroupPublishingService(reportRepo)

    const controller = new FacebookGroupsController(syncService, schedulerService, publishingService)

    // 1. Sync & List joined groups
    const synced = await controller.sync("acc-123")
    expect(synced.length).toBe(2)
    expect(synced[0].name).toContain("Marketing Automation")

    const list = await controller.list()
    expect(list.length).toBe(2)

    // 2. Schedule group post with 10 mins delay
    const scheduledTime = new Date(Date.now() + 1800000).toISOString()
    const sched = await controller.schedule("post-bf-1", [synced[0].id], scheduledTime, 10)
    expect(sched.status).toBe("Pending")
    expect(sched.delayMinutes).toBe(10)

    const queue = await controller.getQueue()
    expect(queue.length).toBe(1)

    // 3. Cancel schedule
    await controller.cancel(sched.postId)
    const queueAfterCancel = await controller.getQueue()
    expect(queueAfterCancel[0].status).toBe("Cancelled")

    // 4. Group Publish log report
    const log = await publishingService.publishToGroup("post-bf-1", synced[0].id, synced[0].name, "acc-123")
    expect(log.status).toBe("success")
    expect(log.groupName).toBe("Marketing Automation Professionals")

    const reports = await controller.getReports()
    expect(reports.length).toBe(1)
  })
})
