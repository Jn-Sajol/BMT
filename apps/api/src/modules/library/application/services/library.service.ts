import { Injectable } from "@nestjs/common"
import { LibraryRepository } from "../../infrastructure/library.repository"
import { LibraryItem, LibraryAssetType } from "../../domain/library-item.model"

@Injectable()
export class LibraryService {
  constructor(private readonly libraryRepository: LibraryRepository) {}

  public async getItems(category?: string): Promise<LibraryItem[]> {
    if (category) {
      return this.libraryRepository.findByCategory(category)
    }
    return this.libraryRepository.findAll()
  }

  public async createItem(
    name: string,
    type: LibraryAssetType,
    category: string,
    url?: string,
    content?: string,
    sizeBytes?: number
  ): Promise<LibraryItem> {
    const item: LibraryItem = {
      id: `lib-${Date.now()}`,
      name,
      type,
      category,
      url,
      content,
      sizeBytes,
      createdAt: new Date(),
    }
    return this.libraryRepository.save(item)
  }
}
