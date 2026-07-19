import { Injectable } from "@nestjs/common"
import { LinkCollection } from "../domain/messenger-link.model"

@Injectable()
export class LinkCollectionRepository {
  private collections: LinkCollection[] = []

  public async save(collection: LinkCollection): Promise<LinkCollection> {
    const idx = this.collections.findIndex((c) => c.id === collection.id)
    if (idx >= 0) {
      this.collections[idx] = collection
    } else {
      this.collections.push(collection)
    }
    return collection
  }

  public async findById(id: string): Promise<LinkCollection | null> {
    return this.collections.find((c) => c.id === id) || null
  }

  public async findAll(): Promise<LinkCollection[]> {
    return this.collections
  }

  public async remove(id: string): Promise<void> {
    this.collections = this.collections.filter((c) => c.id !== id)
  }
}
