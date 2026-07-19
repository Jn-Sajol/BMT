import { Injectable, NotFoundException } from "@nestjs/common"
import { SavedGroupRepository } from "../../infrastructure/saved-group.repository"
import { SearchHistoryRepository } from "../../infrastructure/search-history.repository"
import { DiscoveredGroup, SavedGroup, SearchHistory } from "../../domain/group-hunter.model"

@Injectable()
export class GroupSearchService {
  constructor(
    private readonly savedGroupRepository: SavedGroupRepository,
    private readonly searchHistoryRepository: SearchHistoryRepository
  ) {}

  public async search(keyword: string, country: string, language: string): Promise<DiscoveredGroup[]> {
    console.log(`[GroupSearchService] Manual discovery scan for keyword: ${keyword}, country: ${country}...`)
    
    await this.searchHistoryRepository.save({
      id: `sh-${Date.now()}`,
      keyword,
      country,
      language,
      timestamp: new Date(),
    })

    return [
      {
        id: "disc-1",
        groupId: "8001",
        name: "Shopify Dropshipping Beginners Hub",
        description: "A group dedicated to Shopify store tips and marketing tactics.",
        memberCount: 52000,
        privacy: "Public",
        language,
        country,
        tags: ["ecommerce", "shopify"],
      },
      {
        id: "disc-2",
        groupId: "8002",
        name: "NextJS & React Developers Worldwide",
        description: "Official developer discussion forums for web app builds.",
        memberCount: 12800,
        privacy: "Closed",
        language,
        country,
        tags: ["react", "nextjs"],
      },
    ]
  }

  public async saveGroup(group: DiscoveredGroup, collectionId?: string): Promise<SavedGroup> {
    const saved: SavedGroup = {
      id: `sg-${Date.now()}`,
      discoveredGroup: group,
      collectionId,
      isFavorite: false,
      savedAt: new Date(),
    }
    return this.savedGroupRepository.save(saved)
  }

  public async toggleFavorite(id: string): Promise<SavedGroup> {
    const saved = await this.savedGroupRepository.findById(id)
    if (!saved) {
      throw new NotFoundException("Saved group profile not found.")
    }
    saved.isFavorite = !saved.isFavorite
    return this.savedGroupRepository.save(saved)
  }

  public async getSavedGroups(): Promise<SavedGroup[]> {
    return this.savedGroupRepository.findAll()
  }

  public async getHistory(): Promise<SearchHistory[]> {
    return this.searchHistoryRepository.findAll()
  }
}
