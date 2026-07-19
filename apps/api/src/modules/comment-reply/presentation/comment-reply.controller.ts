import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common"
import { CommentReplyInboxService } from "../application/services/comment-reply-inbox.service"
import { ReplySuggestionService } from "../application/services/reply-suggestion.service"
import { ReplyLibraryService } from "../application/services/reply-library.service"

@Controller("comment-reply")
export class CommentReplyController {
  constructor(
    private readonly commentReplyInboxService: CommentReplyInboxService,
    private readonly replySuggestionService: ReplySuggestionService,
    private readonly replyLibraryService: ReplyLibraryService
  ) {}

  @Get("inbox")
  public async getInbox() {
    return this.commentReplyInboxService.getInbox()
  }

  @Get("inbox/:id")
  public async getInboxById(@Param("id") id: string) {
    return this.commentReplyInboxService.getInboxById(id)
  }

  @Post("suggestions")
  public async generateSuggestions(@Body("inboxId") inboxId: string) {
    const list = await this.replySuggestionService.generateSuggestions(inboxId)
    return { suggestions: list }
  }

  @Post("reply")
  public async approveAndReply(
    @Body("inboxId") inboxId: string,
    @Body("originalComment") originalComment: string,
    @Body("replyText") replyText: string,
    @Body("user") user: string
  ) {
    return this.replySuggestionService.approveAndReply(inboxId, originalComment, replyText, user)
  }

  @Get("history")
  public async getHistory() {
    return this.replySuggestionService.getHistory()
  }

  @Get("templates")
  public async getTemplates() {
    return this.replyLibraryService.getTemplates()
  }

  @Post("templates")
  public async addTemplate(
    @Body("content") content: string,
    @Body("category") category: string,
    @Body("tags") tags: string[],
    @Body("language") language: string
  ) {
    return this.replyLibraryService.addTemplate(content, category, tags, language)
  }

  @Put("templates/:id")
  public async updateTemplate(@Param("id") id: string, @Body() updates: any) {
    return this.replyLibraryService.updateTemplate(id, updates)
  }

  @Delete("templates/:id")
  public async deleteTemplate(@Param("id") id: string) {
    await this.replyLibraryService.deleteTemplate(id)
    return { success: true }
  }

  @Get("reports")
  public async getReports() {
    const list = await this.commentReplyInboxService.getInbox()
    const history = await this.replySuggestionService.getHistory()
    return [
      {
        id: "rep-1",
        totalInboxCount: list.length,
        repliesApprovedCount: history.length,
        repliesSentCount: history.length,
        averageResponseTimeSeconds: 45,
      },
    ]
  }

  @Get("statistics")
  public async getStatistics() {
    const list = await this.commentReplyInboxService.getInbox()
    const templates = await this.replyLibraryService.getTemplates()
    return {
      totalInbox: list.length,
      pendingReplies: list.filter((i) => i.status === "Pending").length,
      completedReplies: list.filter((i) => i.status === "Replied").length,
      templatesCount: templates.length,
    }
  }
}
