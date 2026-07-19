import { LinkCommentRepository } from "../link-comment/infrastructure/link-comment.repository"
import { LinkCommentService } from "../link-comment/application/services/link-comment.service"
import { CommentHistoryRepository } from "../link-comment/infrastructure/comment-history.repository"
import { KeywordFilterService } from "../link-comment/application/services/keyword-filter.service"
import { LinkCommentsController } from "../link-comment/presentation/link-comments.controller"

describe("Link Comment Block (F-31) Unit Tests", () => {
  it("should detect incoming link comments, manually delete or ignore, manage blocked domains/keywords filters, and log history audits", async () => {
    const commentRepo = new LinkCommentRepository()
    const historyRepo = new CommentHistoryRepository()

    const commentService = new LinkCommentService(commentRepo, historyRepo)
    const filterService = new KeywordFilterService()

    const controller = new LinkCommentsController(commentService, filterService)

    // 1. Sync incoming comments containing links
    const comments = await commentService.loadMockComments()
    expect(comments.length).toBe(2)
    expect(comments[0].detectedLinks.length).toBe(1)
    expect(comments[0].status).toBe("Pending")

    // 2. Manual moderation review: Approve one comment
    const approved = await controller.review(comments[0].id, "approve")
    expect(approved.status).toBe("Approved")

    // 3. Manual moderation review: Delete other comment
    const deleted = await controller.deleteComment(comments[1].id)
    expect(deleted.status).toBe("Deleted")

    const history = await controller.getHistory()
    expect(history.length).toBe(2)

    // 4. Blocked Keywords & Domains Manager
    const filters = await controller.getFilters()
    expect(filters.blockedKeywords).toContain("buy now")

    const updatedFilters = await controller.updateBlockedKeywords(["spam product", "discount offers"])
    expect(updatedFilters.blockedKeywords).toContain("spam product")

    // 5. Aggregate statistics report
    const stats = await controller.getStatistics()
    expect(stats.linkComments).toBe(2)
    expect(stats.deleted).toBe(1)
  })
})
