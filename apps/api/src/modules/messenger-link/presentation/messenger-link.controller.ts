import { Controller, Get, Post, Put, Delete, Body, Param, Query } from "@nestjs/common"
import { LinkSearchService } from "../application/services/link-search.service"
import { LinkCollectionService } from "../application/services/link-collection.service"

@Controller("messenger-link")
export class MessengerLinkController {
  constructor(
    private readonly linkSearchService: LinkSearchService,
    private readonly linkCollectionService: LinkCollectionService
  ) {}

  @Get("dashboard")
  public async getDashboard() {
    const list = await this.linkSearchService.getSavedLinks()
    const cols = await this.linkCollectionService.getCollections()
    const history = await this.linkSearchService.getHistory()
    return {
      totalGroups: list.length * 4,
      savedGroups: list.length,
      favoriteGroups: list.filter((l) => l.isFavorite).length,
      collections: cols.length,
      recentSearches: history.length,
      projects: 1,
    }
  }

  @Get("search")
  public async search(
    @Query("keyword") keyword: string,
    @Query("country") country: string,
    @Query("language") language: string
  ) {
    return this.linkSearchService.search(keyword || "SaaS", country || "US", language || "en")
  }

  @Post("links/save")
  public async saveLink(
    @Body("link") link: any,
    @Body("collectionId") collectionId?: string
  ) {
    return this.linkSearchService.saveLink(link, collectionId)
  }

  @Post("links/favorite")
  public async favorite(@Body("id") id: string) {
    return this.linkSearchService.toggleFavorite(id)
  }

  @Post("collections")
  public async createCollection(@Body("name") name: string) {
    return this.linkCollectionService.createCollection(name)
  }

  @Put("collections/:id")
  public async renameCollection(@Param("id") id: string, @Body("name") name: string) {
    return this.linkCollectionService.renameCollection(id, name)
  }

  @Delete("collections/:id")
  public async deleteCollection(@Param("id") id: string) {
    await this.linkCollectionService.deleteCollection(id)
    return { success: true }
  }

  @Get("history")
  public async getHistory() {
    return this.linkSearchService.getHistory()
  }

  @Get("reports")
  public async getReports() {
    const list = await this.linkSearchService.getSavedLinks()
    return [
      {
        id: "lrep-1",
        totalDiscovered: list.length * 4,
        totalSaved: list.length,
        categoryDistribution: { Tech: list.length },
        countryDistribution: { US: list.length },
        languageDistribution: { en: list.length },
      },
    ]
  }

  @Get("statistics")
  public async getStatistics() {
    const list = await this.linkSearchService.getSavedLinks()
    const cols = await this.linkCollectionService.getCollections()
    return {
      totalGroups: list.length * 4,
      savedGroups: list.length,
      favoriteGroups: list.filter((l) => l.isFavorite).length,
      collections: cols.length,
    }
  }
}
