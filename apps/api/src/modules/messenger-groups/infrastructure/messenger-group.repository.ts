import { Injectable } from "@nestjs/common"
import { MessengerGroup } from "../domain/messenger-group.model"

@Injectable()
export class MessengerGroupRepository {
  private groups: MessengerGroup[] = []

  public async save(group: MessengerGroup): Promise<MessengerGroup> {
    const idx = this.groups.findIndex((g) => g.id === group.id)
    if (idx >= 0) {
      this.groups[idx] = group
    } else {
      this.groups.push(group)
    }
    return group
  }

  public async saveAll(items: MessengerGroup[]): Promise<MessengerGroup[]> {
    for (const g of items) {
      await this.save(g)
    }
    return items
  }

  public async findById(id: string): Promise<MessengerGroup | null> {
    return this.groups.find((g) => g.id === id) || null
  }

  public async findAll(): Promise<MessengerGroup[]> {
    return this.groups
  }

  public async removeAll(): Promise<void> {
    this.groups = []
  }
}
