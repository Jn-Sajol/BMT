import { Injectable, NotFoundException } from "@nestjs/common"
import { LinkCollectionRepository } from "../../infrastructure/link-collection.repository"
import { LinkCollection } from "../../domain/messenger-link.model"

@Injectable()
export class LinkCollectionService {
  constructor(private readonly linkCollectionRepository: LinkCollectionRepository) {}

  public async getCollections(): Promise<LinkCollection[]> {
    return this.linkCollectionRepository.findAll()
  }

  public async createCollection(name: string): Promise<LinkCollection> {
    const col: LinkCollection = {
      id: `lcol-${Date.now()}`,
      name,
      createdAt: new Date(),
    }
    return this.linkCollectionRepository.save(col)
  }

  public async renameCollection(id: string, name: string): Promise<LinkCollection> {
    const col = await this.linkCollectionRepository.findById(id)
    if (!col) {
      throw new NotFoundException("Link collection folder not found.")
    }
    col.name = name
    return this.linkCollectionRepository.save(col)
  }

  public async deleteCollection(id: string): Promise<void> {
    await this.linkCollectionRepository.remove(id)
  }
}
