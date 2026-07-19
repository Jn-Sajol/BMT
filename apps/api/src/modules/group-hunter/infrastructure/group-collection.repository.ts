import { Injectable } from "@nestjs/common"
import { GroupCollection } from "../domain/group-hunter.model"

@Injectable()
export class GroupCollectionRepository {
  private collections: GroupCollection[] = []

  public async save(collection: GroupCollection): Promise<GroupCollection> {
    const idx = this.collections.findIndex((c) => c.id === collection.id)
    if (idx >= 0) {
      this.collections[idx] = collection
    } else {
      this.collections.push(collection)
    }
    return collection
  }

  public async findById(id: string): Promise<GroupCollection | null> {
    return this.collections.find((c) => c.id === id) || null
  }

  public async findAll(): Promise<GroupCollection[]> {
    return this.collections
  }

  public async remove(id: string): Promise<void> {
    this.collections = this.collections.filter((c) => c.id !== id)
  }
}
