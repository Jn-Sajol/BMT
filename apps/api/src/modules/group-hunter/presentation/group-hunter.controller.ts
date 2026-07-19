import { Controller, Get, Post, Put, Delete, Body, Param, Query } from "@nestjs/common"
import { GroupSearchService } from "../application/services/group-search.service"
import { GroupCollectionService } from "../application/services/group-collection.service"

@Controller("group-hunter")
export class GroupHunterController {
  constructor(
    private readonly groupSearchService: GroupSearchService,
    private readonly groupCollectionService: GroupCollectionService
  ) {}

  @Get("dashboard")
  public async getDashboard() {
    const list = await this.groupSearchService.getSavedGroups()
    const cols = await this.groupCollectionService.getCollections()
    const history = await this.groupSearchService.getHistory()
    return {
      totalGroups: list.length * 5,
      savedGroups: list.length,
      favoriteGroups: list.filter((g) => g.isFavorite).length,
      collections: cols.length,
      recentSearches: history.length,
      projects: 2,
    }
  }

  @Get("search")
  public async search(
    @Query("keyword") keyword: string,
    @Query("country") country: string,
    @Query("language") language: string
  ) {
    return this.groupSearchService.search(keyword || "SaaS", country || "US", language || "en")
  }

  @Post("groups/save")
  public async saveGroup(
    @Body("group") group: any,
    @Body("collectionId") collectionId?: string
  ) {
    return this.groupSearchService.saveGroup(group, collectionId)
  }

  @Post("groups/favorite")
  public async favorite(@Body("id") id: string) {
    return this.groupSearchService.toggleFavorite(id)
  }

  @Post("collections")
  public async createCollection(@Body("name") name: string) {
    return this.groupCollectionService.createCollection(name)
  }

  @Put("collections/:id")
  public async renameCollection(@Param("id") id: string, @Body("name") name: string) {
    return this.groupCollectionService.renameCollection(id, name)
  }

  @Delete("collections/:id")
  public async deleteCollection(@Param("id") id: string) {
    await this.groupCollectionService.deleteCollection(id)
    return { success: true }
  }

  @Get("history")
  public async getHistory() {
    return this.groupSearchService.getHistory()
  }

  @Get("reports")
  public async getReports() {
    const list = await this.groupSearchService.getSavedGroups()
    return [
      {
        id: "grep-1",
        totalDiscovered: list.length * 5,
        totalSaved: list.length,
        categoryDistribution: { Tech: list.length },
        countryDistribution: { US: list.length },
        languageDistribution: { en: list.length },
      },
    ]
  }

  @Get("statistics")
  public async getStatistics() {
    const list = await this.groupSearchService.getSavedGroups()
    const cols = await this.groupCollectionService.getCollections()
    return {
      totalGroups: list.length * 5,
      savedGroups: list.length,
      favoriteGroups: list.filter((g) => g.isFavorite).length,
      collections: cols.length,
    }
  }
}
