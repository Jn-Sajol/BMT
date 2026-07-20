import { Controller, Get, Post, Param, Body, Query } from "@nestjs/common"
import { InstagramAccountService } from "../application/services/instagram-account.service"
import { InstagramPostService } from "../application/services/instagram-post.service"
import { InstagramInboxService } from "../application/services/instagram-inbox.service"
import { InstagramPostType } from "../domain/instagram.model"

@Controller("instagram")
export class InstagramController {
  constructor(
    private readonly instagramAccountService: InstagramAccountService,
    private readonly instagramPostService: InstagramPostService,
    private readonly instagramInboxService: InstagramInboxService
  ) {}

  @Get("dashboard")
  public async getDashboard() {
    const list = await this.instagramAccountService.getProfiles()
    const posts = await this.instagramPostService.getPosts()
    const threads = await this.instagramInboxService.getThreads()
    return {
      totalProfiles: list.length,
      scheduledPosts: posts.filter((p) => p.status === "Scheduled").length,
      publishedPosts: posts.filter((p) => p.status === "Published").length,
      inboxThreads: threads.length,
      totalFollowers: list.reduce((acc, curr) => acc + curr.followerCount, 0),
    }
  }

  @Get("profiles")
  public async getProfiles() {
    return this.instagramAccountService.getProfiles()
  }

  @Post("profiles/link")
  public async linkProfile(
    @Body("igUserId") igUserId: string,
    @Body("username") username: string,
    @Body("connectedPageId") connectedPageId: string,
    @Body("accessToken") accessToken: string
  ) {
    return this.instagramAccountService.linkProfile(igUserId, username, connectedPageId, accessToken)
  }

  @Get("posts")
  public async getPosts() {
    return this.instagramPostService.getPosts()
  }

  @Post("posts/schedule")
  public async schedulePost(
    @Body("profileId") profileId: string,
    @Body("mediaUrl") mediaUrl: string,
    @Body("caption") caption: string,
    @Body("type") type: InstagramPostType,
    @Body("scheduledFor") scheduledFor?: string
  ) {
    const parsedDate = scheduledFor ? new Date(scheduledFor) : undefined
    return this.instagramPostService.schedulePost(profileId, mediaUrl, caption, type, parsedDate)
  }

  @Get("inbox/threads")
  public async getThreads() {
    return this.instagramInboxService.getThreads()
  }

  @Get("inbox/threads/:id")
  public async getThreadById(@Param("id") id: string) {
    return this.instagramInboxService.getThreadById(id)
  }

  @Post("inbox/send")
  public async sendDM(@Body("threadId") threadId: string, @Body("text") text: string) {
    return this.instagramInboxService.sendDM(threadId, text)
  }

  @Get("reports")
  public async getReports() {
    const list = await this.instagramAccountService.getProfiles()
    const posts = await this.instagramPostService.getPosts()
    return list.map((p) => ({
      id: `ig-rep-${p.id}`,
      profileId: p.id,
      totalPosts: posts.filter((post) => post.profileId === p.id).length,
      totalImpressions: 4800,
      totalReach: 3200,
      totalEngagement: 450,
      followerGrowth: 120,
    }))
  }

  @Get("statistics")
  public async getStatistics() {
    const list = await this.instagramAccountService.getProfiles()
    return {
      totalFollowers: list.reduce((acc, curr) => acc + curr.followerCount, 0),
      totalFollowing: list.reduce((acc, curr) => acc + curr.followingCount, 0),
    }
  }
}
