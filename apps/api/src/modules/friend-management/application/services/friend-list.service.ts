import { Injectable, NotFoundException } from "@nestjs/common"
import { FriendProfileRepository } from "../../infrastructure/friend-profile.repository"
import { FriendActivityRepository } from "../../infrastructure/friend-activity.repository"
import { FriendProfile, FriendCategory } from "../../domain/friend.model"

@Injectable()
export class FriendListService {
  constructor(
    private readonly friendProfileRepository: FriendProfileRepository,
    private readonly friendActivityRepository: FriendActivityRepository
  ) {}

  public async getFriends(): Promise<FriendProfile[]> {
    return this.friendProfileRepository.findAll()
  }

  public async updateCategory(id: string, category: FriendCategory, user: string): Promise<FriendProfile> {
    const friend = await this.friendProfileRepository.findById(id)
    if (!friend) {
      throw new NotFoundException("Friend profile not found.")
    }
    friend.category = category
    await this.friendProfileRepository.save(friend)

    await this.friendActivityRepository.save({
      id: `act-${Date.now()}`,
      friendId: id,
      action: "category_change",
      user,
      timestamp: new Date(),
    })
    return friend
  }

  public async loadMockFriends(): Promise<FriendProfile[]> {
    const mocks: FriendProfile[] = [
      {
        id: "fr-1",
        fbFriendId: "fb-fr-100",
        name: "Alice Cooper",
        category: "Favorites",
        status: "Active",
        addedAt: new Date(Date.now() - 30 * 86400000),
        lastInteractionAt: new Date(),
      },
      {
        id: "fr-2",
        fbFriendId: "fb-fr-101",
        name: "Bob Dylan",
        category: "Leads",
        status: "Inactive",
        addedAt: new Date(Date.now() - 95 * 86400000),
        lastInteractionAt: new Date(Date.now() - 65 * 86400000),
      },
    ]
    return this.friendProfileRepository.saveAll(mocks)
  }
}
