import { InstagramProfileRepository } from "../instagram/infrastructure/instagram-profile.repository"
import { InstagramPostRepository } from "../instagram/infrastructure/instagram-post.repository"
import { InstagramDMRepository } from "../instagram/infrastructure/instagram-dm.repository"
import { InstagramAccountService } from "../instagram/application/services/instagram-account.service"
import { InstagramPostService } from "../instagram/application/services/instagram-post.service"
import { InstagramInboxService } from "../instagram/application/services/instagram-inbox.service"
import { InstagramController } from "../instagram/presentation/instagram.controller"

describe("Instagram Marketing (F-35) Unit Tests", () => {
  it("should link profiles, schedule media posts, parse DMs in inbox, send replies, and compute dashboard statistics", async () => {
    const profileRepo = new InstagramProfileRepository()
    const postRepo = new InstagramPostRepository()
    const dmRepo = new InstagramDMRepository()

    const accountService = new InstagramAccountService(profileRepo)
    const postService = new InstagramPostService(postRepo)
    const inboxService = new InstagramInboxService(dmRepo)

    const controller = new InstagramController(accountService, postService, inboxService)

    // 1. Sync mock profiles
    const profiles = await accountService.loadMockProfiles()
    expect(profiles.length).toBe(1)
    expect(profiles[0].username).toBe("bmt_marketing_agent")

    // 2. Mapped link profiles OAuth trigger
    const linked = await controller.linkProfile("ig-user-200", "travel_blogger_ig", "fb-page-200", "ig-token-200")
    expect(linked.igUserId).toBe("ig-user-200")

    // 3. Schedule Feed post publication
    const post = await controller.schedulePost(linked.id, "https://bmt-cdn.s3.amazonaws.com/posts/photo.jpg", "Sunset views from Greece!", "Feed", undefined)
    expect(post.publishedPostId).toBeDefined()
    expect(post.status).toBe("Published")

    // 4. Mapped inbox threads sync
    const threads = await inboxService.loadMockThreads()
    expect(threads.length).toBe(1)
    expect(threads[0].participantUsername).toBe("buyer_lead_prospect")

    // 5. Send inbox DM reply
    const reply = await controller.sendDM(threads[0].id, "Our pricing plans start at $49/mo.")
    expect(reply.text).toBe("Our pricing plans start at $49/mo.")
    expect(reply.senderUsername).toBe("me")

    // 6. Compute reports and analytics
    const dashboard = await controller.getDashboard()
    expect(dashboard.totalProfiles).toBe(2)
    expect(dashboard.publishedPosts).toBe(1)
  })
})
