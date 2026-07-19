import { FacebookAccountRepository } from "../facebook-connect/infrastructure/facebook-account.repository"
import { FacebookAccountService } from "../facebook-connect/application/services/facebook-account.service"
import { FacebookPageRepository } from "../facebook-connect/infrastructure/facebook-page.repository"
import { FacebookPageService } from "../facebook-connect/application/services/facebook-page.service"
import { FacebookTokenService } from "../facebook-connect/application/services/facebook-token.service"
import { FacebookConnectController } from "../facebook-connect/presentation/facebook-connect.controller"

import { MasterPostRepository } from "../facebook-market/infrastructure/master-post.repository"
import { MasterPostService } from "../facebook-market/application/services/master-post.service"
import { ScheduleRepository } from "../facebook-market/infrastructure/schedule.repository"
import { SchedulerService } from "../facebook-market/application/services/scheduler.service"
import { ReportRepository } from "../facebook-market/infrastructure/report.repository"
import { PublishingService } from "../facebook-market/application/services/publishing.service"
import { CalendarService } from "../facebook-market/application/services/calendar.service"
import { ReportService } from "../facebook-market/application/services/report.service"
import { FacebookMarketController } from "../facebook-market/presentation/facebook-market.controller"

describe("Facebook Connect & Market (F-23 & F-24) Unit Tests", () => {
  // 1. Facebook Connect Module
  it("should connect account, list pages, check permissions and disconnect account", async () => {
    const accRepo = new FacebookAccountRepository()
    const pageRepo = new FacebookPageRepository()

    const accService = new FacebookAccountService(accRepo)
    const pageService = new FacebookPageService(pageRepo)
    const tokenService = new FacebookTokenService(accRepo)

    const controller = new FacebookConnectController(accService, pageService, tokenService)

    const acc = await controller.connectAccount("fb-user-1", "Sajol", "token-123", 3600000)
    expect(acc.fbUserId).toBe("fb-user-1")

    const status = await controller.getStatus(acc.id)
    expect(status.valid).toBe(true)

    const permissions = await controller.getPermissions(acc.id)
    expect(permissions.some((p) => p.name === "pages_manage_posts")).toBe(true)

    const page = await controller.connectPage("fb-page-1", "BMT Page", "page-token-123", acc.id)
    expect(page.pageId).toBe("fb-page-1")

    const listPages = await controller.getPages()
    expect(listPages.length).toBe(1)

    await controller.disconnect(acc.id)
    const afterList = await controller.getAccounts()
    expect(afterList.length).toBe(0)
  })

  // 2. Facebook Market Module
  it("should create a master post, duplicate, schedule, cancel, publish and list logs", async () => {
    const postRepo = new MasterPostRepository()
    const schedRepo = new ScheduleRepository()
    const reportRepo = new ReportRepository()

    const postService = new MasterPostService(postRepo)
    const schedService = new SchedulerService(schedRepo, postRepo)
    const pubService = new PublishingService(postRepo, reportRepo)
    const calService = new CalendarService(schedRepo, postRepo)
    const reportService = new ReportService(reportRepo)

    const controller = new FacebookMarketController(postService, schedService, pubService, calService, reportService)

    const post = await controller.create(
      "Black Friday Ad",
      "Get BMT Premium now!",
      [{ id: "a-1", type: "Photo", url: "http://photo.jpg" }],
      [{ id: "t-1", targetId: "page-1", type: "Page" }],
      "http://bmt.com/premium",
      "Click the link above!"
    )
    expect(post.status).toBe("Draft")
    expect(post.title).toBe("Black Friday Ad")

    const list = await controller.listPosts()
    expect(list.length).toBe(1)

    const dup = await controller.duplicate(post.id)
    expect(dup.title).toContain("Copy")

    const scheduleTime = new Date(Date.now() + 3600000).toISOString()
    const sched = await controller.schedule(post.id, scheduleTime)
    expect(sched.status).toBe("Pending")

    const queue = await controller.getQueue()
    expect(queue.length).toBe(1)

    await controller.cancel(post.id)
    const postAfterCancel = await controller.getById(post.id)
    expect(postAfterCancel.status).toBe("Cancelled")

    const pubRes = await controller.publish(post.id)
    expect(pubRes.status).toBe("success")

    const reports = await controller.getReports()
    expect(reports.length).toBe(1)
    expect(reports[0].facebookPostId).toBeDefined()
  })
})
