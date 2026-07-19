import { CommentInboxRepository } from "../comment-reply/infrastructure/comment-inbox.repository"
import { CommentReplyInboxService } from "../comment-reply/application/services/comment-reply-inbox.service"
import { ReplySuggestionService } from "../comment-reply/application/services/reply-suggestion.service"
import { ReplyTemplateRepository } from "../comment-reply/infrastructure/reply-template.repository"
import { ReplyLibraryService } from "../comment-reply/application/services/reply-library.service"
import { CommentReplyController } from "../comment-reply/presentation/comment-reply.controller"

describe("AI Reply Comment Assistant (F-27) Unit Tests", () => {
  it("should receive incoming comment, get AI suggestions, manually approve, and update reply templates", async () => {
    const inboxRepo = new CommentInboxRepository()
    const templateRepo = new ReplyTemplateRepository()

    const inboxService = new CommentReplyInboxService(inboxRepo)
    const suggestionService = new ReplySuggestionService(inboxRepo)
    const libraryService = new ReplyLibraryService(templateRepo)

    const controller = new CommentReplyController(inboxService, suggestionService, libraryService)

    // 1. Incoming Comment Inbox
    const item = await inboxService.loadMockInboxItem("Sajol", "Is this software compatible with mobile?")
    expect(item.status).toBe("Pending")
    expect(item.authorName).toBe("Sajol")

    const thread = await inboxService.getThread(item.id)
    expect(thread.messages.length).toBe(1)

    // 2. AI Suggestions
    const suggestionsRes = await controller.generateSuggestions(item.id)
    expect(suggestionsRes.suggestions.length).toBe(3)

    // 3. Manual Reply approval
    const replyLog = await controller.approveAndReply(
      item.id,
      item.content,
      "Yes, it supports all modern mobile platforms!",
      "moderator-1"
    )
    expect(replyLog.selectedReply).toContain("Yes, it supports")

    const statusAfter = await controller.getInboxById(item.id)
    expect(statusAfter.status).toBe("Replied")

    const history = await controller.getHistory()
    expect(history.length).toBe(1)

    // 4. Reply Templates Library CRUD
    const template = await controller.addTemplate("Thank you for your feedback!", "Greeting", ["thanks", "polite"], "en")
    expect(template.content).toBe("Thank you for your feedback!")

    const updated = await controller.updateTemplate(template.id, { content: "Appreciate your review!" })
    expect(updated.content).toBe("Appreciate your review!")

    const templatesList = await controller.getTemplates()
    expect(templatesList.length).toBe(1)

    const stats = await controller.getStatistics()
    expect(stats.totalInbox).toBe(1)
    expect(stats.completedReplies).toBe(1)
    expect(stats.templatesCount).toBe(1)

    await controller.deleteTemplate(template.id)
    const listAfterDelete = await controller.getTemplates()
    expect(listAfterDelete.length).toBe(0)
  })
})
