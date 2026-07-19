import { Injectable } from "@nestjs/common"
import { FriendProfile } from "../domain/friend.model"

@Injectable()
export class FriendProfileRepository {
  private friends: FriendProfile[] = []

  public async save(profile: FriendProfile): Promise<FriendProfile> {
    const idx = this.friends.findIndex((f) => f.id === profile.id)
    if (idx >= 0) {
      this.friends[idx] = profile
    } else {
      this.friends.push(profile)
    }
    return profile
  }

  public async saveAll(profiles: FriendProfile[]): Promise<FriendProfile[]> {
    for (const p of profiles) {
      await this.save(p)
    }
    return profiles
  }

  public async findById(id: string): Promise<FriendProfile | null> {
    return this.friends.find((f) => f.id === id) || null
  }

  public async findAll(): Promise<FriendProfile[]> {
    return this.friends
  }

  public async remove(id: string): Promise<void> {
    this.friends = this.friends.filter((f) => f.id !== id)
  }
}
