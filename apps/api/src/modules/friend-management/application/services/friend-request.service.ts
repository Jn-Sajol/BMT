import { Injectable, NotFoundException } from "@nestjs/common"
import { FriendRequestRepository } from "../../infrastructure/friend-request.repository"
import { FriendActivityRepository } from "../../infrastructure/friend-activity.repository"
import { FriendRequest } from "../../domain/friend.model"

@Injectable()
export class FriendRequestService {
  constructor(
    private readonly friendRequestRepository: FriendRequestRepository,
    private readonly friendActivityRepository: FriendActivityRepository
  ) {}

  public async getRequests(): Promise<FriendRequest[]> {
    return this.friendRequestRepository.findAll()
  }

  public async acceptRequest(id: string, user: string): Promise<FriendRequest> {
    const request = await this.friendRequestRepository.findById(id)
    if (!request) {
      throw new NotFoundException("Friend request not found.")
    }
    request.status = "accepted"
    await this.friendRequestRepository.save(request)

    await this.friendActivityRepository.save({
      id: `act-${Date.now()}`,
      friendId: request.id,
      action: "request_accepted",
      user,
      timestamp: new Date(),
    })
    return request
  }

  public async rejectRequest(id: string, user: string): Promise<FriendRequest> {
    const request = await this.friendRequestRepository.findById(id)
    if (!request) {
      throw new NotFoundException("Friend request not found.")
    }
    request.status = "rejected"
    await this.friendRequestRepository.save(request)

    await this.friendActivityRepository.save({
      id: `act-${Date.now()}`,
      friendId: request.id,
      action: "request_rejected",
      user,
      timestamp: new Date(),
    })
    return request
  }

  public async cancelRequest(id: string): Promise<FriendRequest> {
    const request = await this.friendRequestRepository.findById(id)
    if (!request) {
      throw new NotFoundException("Friend request not found.")
    }
    request.status = "cancelled"
    return this.friendRequestRepository.save(request)
  }

  public async loadMockRequests(): Promise<FriendRequest[]> {
    const mocks: FriendRequest[] = [
      {
        id: "req-1",
        fbUserId: "fb-usr-200",
        name: "Carol Danvers",
        type: "incoming",
        status: "pending",
        createdAt: new Date(),
      },
      {
        id: "req-2",
        fbUserId: "fb-usr-201",
        name: "Diana Prince",
        type: "outgoing",
        status: "pending",
        createdAt: new Date(),
      },
    ]
    return this.friendRequestRepository.saveAll(mocks)
  }
}
