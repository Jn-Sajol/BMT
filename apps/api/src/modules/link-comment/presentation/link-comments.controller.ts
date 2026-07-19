import { Controller, Get, Post, Param, Body } from "@nestjs/common"
import { LinkCommentService } from "../application/services/link-comment.service"
import { KeywordFilterService } from "../application/services/keyword-filter.service"

@Controller("link-comments")
export class LinkCommentsController {
  constructor(
    private readonly linkCommentService: LinkCommentService,
    private readonly keywordFilterService: KeywordFilterService
  ) {}

  @Get("dashboard")
  public async getDashboard() {
    const list = await this.linkCommentService.getComments()
    return {
      totalComments: list.length * 3,
      linkComments: list.length,
      reviewed: list.filter((c) => c.status !== "Pending").length,
      pending: list.filter((c) => c.status === "Pending").length,
      deleted: list.filter((c) => c.status === "Deleted").length,
      ignored: list.filter((c) => c.status === "Ignored").length,
    }
  }

  @Get()
  public async getComments() {
    return this.linkCommentService.getComments()
  }

  @Get(":id")
  public async getCommentById(@Param("id") id: string) {
    return this.linkCommentService.getCommentById(id)
  }

  @Post("review")
  public async review(@Body("commentId") commentId: string, @Body("action") action: string) {
    if (action === "approve") {
      return this.linkCommentService.approveComment(commentId, "moderator-1")
    }
    return this.linkCommentService.ignoreComment(commentId, "moderator-1")
  }

  @Post("delete")
  public async deleteComment(@Body("commentId") commentId: string) {
    return this.linkCommentService.deleteComment(commentId, "moderator-1")
  }

  @Post("archive")
  public async archiveComment(@Body("commentId") commentId: string) {
    return this.linkCommentService.archiveComment(commentId, "moderator-1")
  }

  @Post("ignore")
  public async ignoreComment(@Body("commentId") commentId: string) {
    return this.linkCommentService.ignoreComment(commentId, "moderator-1")
  }

  @Get("history")
  public async getHistory() {
    return this.linkCommentService.getHistory()
  }

  @Get("reports")
  public async getReports() {
    const list = await this.linkCommentService.getComments()
    return [
      {
        id: "lrep-1",
        totalCommentsCount: list.length * 3,
        linkCommentsCount: list.length,
        deletedCommentsCount: list.filter((c) => c.status === "Deleted").length,
        ignoredCommentsCount: list.filter((c) => c.status === "Ignored").length,
        topDomains: ["malicious-spam-url.ru"],
      },
    ]
  }

  @Get("statistics")
  public async getStatistics() {
    const list = await this.linkCommentService.getComments()
    return {
      totalComments: list.length * 3,
      linkComments: list.length,
      reviewed: list.filter((c) => c.status !== "Pending").length,
      pending: list.filter((c) => c.status === "Pending").length,
      deleted: list.filter((c) => c.status === "Deleted").length,
      ignored: list.filter((c) => c.status === "Ignored").length,
    }
  }

  @Get("settings/filters")
  public async getFilters() {
    return this.keywordFilterService.getSettings()
  }

  @Post("settings/filters/keywords")
  public async updateBlockedKeywords(@Body("keywords") keywords: string[]) {
    return this.keywordFilterService.updateBlockedKeywords(keywords)
  }

  @Post("settings/filters/domains")
  public async updateBlockedDomains(@Body("domains") domains: string[]) {
    return this.keywordFilterService.updateBlockedDomains(domains)
  }
}
