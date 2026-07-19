import { Injectable, NotFoundException } from "@nestjs/common"
import { GroupCollectionRepository } from "../../infrastructure/group-collection.repository"
import { GroupCollection } from "../../domain/group-hunter.model"

@Injectable()
export class GroupCollectionService {
  constructor(private readonly groupCollectionRepository: GroupCollectionRepository) {}

  public async getCollections(): Promise<GroupCollection[]> {
    return this.groupCollectionRepository.findAll()
  }

  public async createCollection(name: string): Promise<GroupCollection> {
    const col: GroupCollection = {
      id: `col-${Date.now()}`,
      name,
      isFavorite: false,
      createdAt: new Date(),
    }
    return this.groupCollectionRepository.save(col)
  }

  public async renameCollection(id: string, name: string): Promise<GroupCollection> {
    const col = await this.groupCollectionRepository.findById(id)
    if (!col) {
      throw new NotFoundException("Group collection directory not found.")
    }
    col.name = name
    return this.groupCollectionRepository.save(col)
  }

  public async deleteCollection(id: string): Promise<void> {
    await this.groupCollectionRepository.remove(id)
  }
}
