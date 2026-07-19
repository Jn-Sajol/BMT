import { FriendProfileRepository } from "../friend-management/infrastructure/friend-profile.repository"
import { FriendListService } from "../friend-management/application/services/friend-list.service"
import { FriendRequestRepository } from "../friend-management/infrastructure/friend-request.repository"
import { FriendRequestService } from "../friend-management/application/services/friend-request.service"
import { FriendActivityRepository } from "../friend-management/infrastructure/friend-activity.repository"
import { FriendUnfriendService } from "../friend-management/application/services/friend-unfriend.service"
import { FriendManagementController } from "../friend-management/presentation/friend-management.controller"

describe("Friend Management Assistant (F-30) Unit Tests", () => {
  it("should list synced friends, accept requests, list candidates, execute unfriend, and update stats", async () => {
    const profileRepo = new FriendProfileRepository()
    const requestRepo = new FriendRequestRepository()
    const activityRepo = new FriendActivityRepository()

    const listService = new FriendListService(profileRepo, activityRepo)
    const requestService = new FriendRequestService(requestRepo, activityRepo)
    const unfriendService = new FriendUnfriendService(profileRepo, activityRepo)

    const controller = new FriendManagementController(listService, requestService, unfriendService)

    // 1. Sync Friends List
    const friends = await listService.loadMockFriends()
    expect(friends.length).toBe(2)
    expect(friends[0].name).toBe("Alice Cooper")

    const friendsRes = await controller.getFriends()
    expect(friendsRes.length).toBe(2)

    // 2. Change Category
    const updatedCategory = await listService.updateCategory(friends[0].id, "Business", "moderator-1")
    expect(updatedCategory.category).toBe("Business")

    // 3. Requests manager accepts
    const requests = await requestService.loadMockRequests()
    expect(requests.length).toBe(2)

    const accepted = await controller.accept(requests[0].id)
    expect(accepted.status).toBe("accepted")

    // 4. Unfriend Candidates list
    const candidates = await controller.getCandidates()
    expect(candidates.length).toBe(1)
    expect(candidates[0].name).toBe("Bob Dylan")

    // 5. Execute Unfriend
    const removedRes = await controller.unfriend(friends[1].id)
    expect(removedRes.success).toBe(true)

    const friendsAfter = await controller.getFriends()
    expect(friendsAfter.length).toBe(1)

    const stats = await controller.getStatistics()
    expect(stats.totalFriends).toBe(1)
  })
})
