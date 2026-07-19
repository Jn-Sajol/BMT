import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common"
import { MasterPostService } from "../application/services/master-post.service"
import { SchedulerService } from "../application/services/scheduler.service"
import { PublishingService } from "../application/services/publishing.service"
import { CalendarService } from "../application/services/calendar.service"
import { ReportService } from "../application/services/report.service"
import { PostAsset } from "../domain/post-asset.model"
import { PostTarget } from "../domain/post-target.model"

@Controller("facebook-market")
export class FacebookMarketController {
  constructor(
    private readonly masterPostService: MasterPostService,
    private readonly schedulerService: SchedulerService,
    private readonly publishingService: PublishingService,
    private readonly calendarService: CalendarService,
    private readonly reportService: ReportService
  ) {}

  @Get("posts")
  public async listPosts() {
    return this.masterPostService.getPosts()
  }

  @Post("posts")
  public async create(
    @Body("title") title: string,
    @Body("description") description: string,
    @Body("assets") assets: PostAsset[],
    @Body("targets") targets: PostTarget[],
    @Body("ctaLink") ctaLink?: string,
    @Body("pinCommentText") pinCommentText?: string
  ) {
    return this.masterPostService.createPost(title, description, assets, targets, ctaLink, pinCommentText)
  }

  @Put("posts/:id")
  public async update(@Param("id") id: string, @Body() updates: any) {
    return this.masterPostService.updatePost(id, updates)
  }

  @Delete("posts/:id")
  public async delete(@Param("id") id: string) {
    await this.masterPostService.deletePost(id)
    return { success: true }
  }

  @Get("posts/:id")
  public async getById(@Param("id") id: string) {
    return this.masterPostService.getPostById(id)
  }

  @Post("posts/:id/duplicate")
  public async duplicate(@Param("id") id: string) {
    return this.masterPostService.duplicatePost(id)
  }

  @Post("posts/:id/schedule")
  public async schedule(@Param("id") id: string, @Body("scheduledAt") scheduledAt: string) {
    return this.schedulerService.schedulePost(id, new Date(scheduledAt))
  }

  @Post("posts/:id/cancel")
  public async cancel(@Param("id") id: string) {
    await this.schedulerService.cancelSchedule(id)
    return { success: true }
  }

  @Post("posts/:id/publish")
  public async publish(@Param("id") id: string) {
    return this.publishingService.publishInstant(id)
  }

  @Get("posts/:id/history")
  public async getHistory(@Param("id") id: string) {
    // Returns dummy state audit logs
    return [
      { status: "Draft", timestamp: new Date(Date.now() - 3600 * 1000) },
      { status: "Scheduled", timestamp: new Date() },
    ]
  }

  @Get("calendar")
  public async getCalendar() {
    return this.calendarService.getCalendarEvents()
  }

  @Get("queue")
  public async getQueue() {
    return this.schedulerService.getQueue()
  }

  @Get("reports")
  public async getReports() {
    return this.reportService.getReports()
  }
}
