import { Controller, Get, Post, Param, Body } from "@nestjs/common"
import { FriendListService } from "../application/services/friend-list.service"
import { FriendRequestService } from "../application/services/friend-request.service"
import { FriendUnfriendService } from "../application/services/friend-unfriend.service"

@Controller("friend-management")
export class FriendManagementController {
  constructor(
    private readonly friendListService: FriendListService,
    private readonly friendRequestService: FriendRequestService,
    private readonly friendUnfriendService: FriendUnfriendService
  ) {}

  @Get("dashboard")
  public async getDashboard() {
    const list = await this.friendListService.getFriends()
    const reqs = await this.friendRequestService.getRequests()
    return {
      totalFriends: list.length,
      pendingRequests: reqs.filter((r) => r.status === "pending").length,
      acceptedRequests: reqs.filter((r) => r.status === "accepted").length,
      inactiveFriends: list.filter((f) => f.status === "Inactive").length,
    }
  }

  @Get("friends")
  public async getFriends() {
    return this.friendListService.getFriends()
  }

  @Get("requests")
  public async getRequests() {
    return this.friendRequestService.getRequests()
  }

  @Post("requests/:id/accept")
  public async accept(@Param("id") id: string) {
    return this.friendRequestService.acceptRequest(id, "operator-1")
  }

  @Post("requests/:id/reject")
  public async reject(@Param("id") id: string) {
    return this.friendRequestService.rejectRequest(id, "operator-1")
  }

  @Post("requests/:id/cancel")
  public async cancel(@Param("id") id: string) {
    return this.friendRequestService.cancelRequest(id)
  }

  @Get("unfriend-candidates")
  public async getCandidates() {
    return this.friendUnfriendService.getUnfriendCandidates()
  }

  @Post("unfriend")
  public async unfriend(@Body("friendId") friendId: string) {
    return this.friendUnfriendService.executeUnfriend(friendId, "operator-1")
  }

  @Get("history")
  public async getHistory() {
    return this.friendUnfriendService.getActivities()
  }

  @Get("reports")
  public async getReports() {
    const list = await this.friendListService.getFriends()
    return [
      {
        id: "frep-1",
        totalFriendsCount: list.length,
        pendingRequestsCount: 0,
        acceptanceRatePercentage: 80,
        categoryDistribution: { Favorites: list.length },
        removalsCount: 0,
      },
    ]
  }

  @Get("statistics")
  public async getStatistics() {
    const list = await this.friendListService.getFriends()
    const reqs = await this.friendRequestService.getRequests()
    return {
      totalFriends: list.length,
      pendingRequests: reqs.filter((r) => r.status === "pending").length,
      acceptedRequests: reqs.filter((r) => r.status === "accepted").length,
      inactiveFriends: list.filter((f) => f.status === "Inactive").length,
    }
  }
}
