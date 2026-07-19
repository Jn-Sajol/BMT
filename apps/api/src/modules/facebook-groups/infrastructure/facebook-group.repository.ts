import { Injectable } from "@nestjs/common"
import { FacebookGroup } from "../domain/facebook-group.model"

@Injectable()
export class FacebookGroupRepository {
  private groups: FacebookGroup[] = []

  public async save(group: FacebookGroup): Promise<FacebookGroup> {
    const idx = this.groups.findIndex((g) => g.id === group.id)
    if (idx >= 0) {
      this.groups[idx] = group
    } else {
      this.groups.push(group)
    }
    return group
  }

  public async saveAll(items: FacebookGroup[]): Promise<FacebookGroup[]> {
    for (const g of items) {
      await this.save(g)
    }
    return items
  }

  public async findById(id: string): Promise<FacebookGroup | null> {
    return this.groups.find((g) => g.id === id) || null
  }

  public async findAll(): Promise<FacebookGroup[]> {
    return this.groups
  }

  public async removeAll(): Promise<void> {
    this.groups = []
  }
}
