import { Injectable } from "@nestjs/common"
import { LibraryItem } from "../domain/library-item.model"

@Injectable()
export class LibraryRepository {
  private items: LibraryItem[] = []

  public async save(item: LibraryItem): Promise<LibraryItem> {
    this.items.push(item)
    return item
  }

  public async findAll(): Promise<LibraryItem[]> {
    return this.items
  }

  public async findByCategory(category: string): Promise<LibraryItem[]> {
    return this.items.filter((item) => item.category.toLowerCase() === category.toLowerCase())
  }
}
