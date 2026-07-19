import { Injectable } from "@nestjs/common"
import { FriendActivity } from "../domain/friend.model"

@Injectable()
export class FriendActivityRepository {
  private activities: FriendActivity[] = []

  public async save(activity: FriendActivity): Promise<FriendActivity> {
    this.activities.push(activity)
    return activity
  }

  public async findAll(): Promise<FriendActivity[]> {
    return this.activities
  }
}
