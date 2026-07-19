import { Injectable, NotFoundException } from "@nestjs/common"
import { FriendProfileRepository } from "../../infrastructure/friend-profile.repository"
import { FriendActivityRepository } from "../../infrastructure/friend-activity.repository"
import { FriendProfile, UnfriendCandidate } from "../../domain/friend.model"

@Injectable()
export class FriendUnfriendService {
  constructor(
    private readonly friendProfileRepository: FriendProfileRepository,
    private readonly friendActivityRepository: FriendActivityRepository
  ) {}

  public async getUnfriendCandidates(): Promise<UnfriendCandidate[]> {
    const list = await this.friendProfileRepository.findAll()
    const cutoff = 60 * 86400000 // 60 days
    const candidates: UnfriendCandidate[] = []

    for (const f of list) {
      const inactiveMs = Date.now() - f.lastInteractionAt.getTime()
      if (inactiveMs > cutoff) {
        candidates.push({
          id: `cand-${f.id}`,
          friendId: f.id,
          name: f.name,
          daysInactive: Math.floor(inactiveMs / 86400000),
        })
      }
    }
    return candidates
  }

  public async executeUnfriend(friendId: string, user: string): Promise<{ success: boolean }> {
    const friend = await this.friendProfileRepository.findById(friendId)
    if (!friend) {
      throw new NotFoundException("Friend profile not found to unfriend.")
    }
    await this.friendProfileRepository.remove(friendId)

    await this.friendActivityRepository.save({
      id: `act-${Date.now()}`,
      friendId,
      action: "removed",
      user,
      timestamp: new Date(),
    })
    return { success: true }
  }

  public async getActivities(): Promise<any[]> {
    return this.friendActivityRepository.findAll()
  }
}
