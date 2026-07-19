import { Injectable } from "@nestjs/common"
import { FriendRequest } from "../domain/friend.model"

@Injectable()
export class FriendRequestRepository {
  private requests: FriendRequest[] = []

  public async save(request: FriendRequest): Promise<FriendRequest> {
    const idx = this.requests.findIndex((r) => r.id === request.id)
    if (idx >= 0) {
      this.requests[idx] = request
    } else {
      this.requests.push(request)
    }
    return request
  }

  public async saveAll(items: FriendRequest[]): Promise<FriendRequest[]> {
    for (const i of items) {
      await this.save(i)
    }
    return items
  }

  public async findById(id: string): Promise<FriendRequest | null> {
    return this.requests.find((r) => r.id === id) || null
  }

  public async findAll(): Promise<FriendRequest[]> {
    return this.requests
  }
}
