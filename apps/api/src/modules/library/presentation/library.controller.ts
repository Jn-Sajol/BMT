import { Controller, Get, Post, Body, Query } from "@nestjs/common"
import { LibraryService } from "../application/services/library.service"
import { LibraryAssetType } from "../domain/library-item.model"

@Controller("library")
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get()
  public async listItems(@Query("category") category?: string) {
    return this.libraryService.getItems(category)
  }

  @Post("upload")
  public async uploadItem(
    @Body("name") name: string,
    @Body("type") type: LibraryAssetType,
    @Body("category") category: string,
    @Body("url") url?: string,
    @Body("content") content?: string,
    @Body("sizeBytes") sizeBytes?: number
  ) {
    return this.libraryService.createItem(name, type, category, url, content, sizeBytes)
  }
}
