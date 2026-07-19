import { ConversationInboxRepository } from "../messenger-controller/infrastructure/conversation-inbox.repository"
import { MessengerInboxService } from "../messenger-controller/application/services/messenger-inbox.service"
import { MessengerSuggestionService } from "../messenger-controller/application/services/messenger-suggestion.service"
import { MessageTemplateRepository } from "../messenger-controller/infrastructure/message-template.repository"
import { MessageLibraryService } from "../messenger-controller/application/services/message-library.service"
import { MessengerControllerController } from "../messenger-controller/presentation/messenger-controller.controller"

describe("Messenger Controller (F-28) Unit Tests", () => {
  it("should create conversation thread, select AI reply suggestions, and CRUD templates library", async () => {
    const inboxRepo = new ConversationInboxRepository()
    const templateRepo = new MessageTemplateRepository()

    const inboxService = new MessengerInboxService(inboxRepo)
    const suggestionService = new MessengerSuggestionService(inboxRepo)
    const libraryService = new MessageLibraryService(templateRepo)

    const controller = new MessengerControllerController(inboxService, suggestionService, libraryService)

    // 1. Thread Viewer
    const item = await inboxService.loadMockConversation("Sajol", "Interested in SaaS visit bookings.", "Visit Conversion")
    expect(item.category).toBe("Visit Conversion")

    const thread = await inboxService.getThread(item.id)
    expect(thread.messages.length).toBe(1)

    // 2. AI Suggestions
    const suggestionsRes = await controller.generateSuggestions(item.id)
    expect(suggestionsRes.suggestions.length).toBe(3)

    // 3. Manual Reply Approval
    const replyLog = await controller.approveAndReply(
      item.id,
      item.lastMessageText,
      "Hi Sajol, we have booking slots open tomorrow!",
      "moderator-2"
    )
    expect(replyLog.selectedSuggestion).toContain("booking slots open")

    const history = await controller.getHistory()
    expect(history.length).toBe(1)

    // 4. Message Library Templates CRUD
    const template = await controller.addTemplate("Hi there, how can we help?", "Sales", ["hello", "welcome"], "en")
    expect(template.content).toBe("Hi there, how can we help?")

    const updated = await controller.updateTemplate(template.id, { content: "Welcome to BMT Support!" })
    expect(updated.content).toBe("Welcome to BMT Support!")

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
