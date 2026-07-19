import { Injectable, NotFoundException } from "@nestjs/common"
import { SavedLinkRepository } from "../../infrastructure/saved-link.repository"
import { SearchHistoryRepository } from "../../infrastructure/search-history.repository"
import { DiscoveredMessengerLink, SavedMessengerLink, LinkSearchHistory } from "../../domain/messenger-link.model"

@Injectable()
export class LinkSearchService {
  constructor(
    private readonly savedLinkRepository: SavedLinkRepository,
    private readonly searchHistoryRepository: SearchHistoryRepository
  ) {}

  public async search(keyword: string, country: string, language: string): Promise<DiscoveredMessengerLink[]> {
    console.log(`[LinkSearchService] Simulating Messenger invite links discovery for keyword: ${keyword}, country: ${country}...`)

    await this.searchHistoryRepository.save({
      id: `lsh-${Date.now()}`,
      keyword,
      country,
      language,
      timestamp: new Date(),
    })

    return [
      {
        id: "disc-link-1",
        groupId: "9001",
        groupName: "Dropshipping Mastermind Chat",
        inviteUrl: "https://m.me/j/AbY3zX9aBcD1eF2g/",
        memberCount: 145,
        messageFrequencyDaily: 28,
        status: "Active",
        country,
        language,
        tags: ["dropshipping", "chat"],
        createdAt: new Date(),
      },
      {
        id: "disc-link-2",
        groupId: "9002",
        groupName: "SaaS Builders Secret Room",
        inviteUrl: "https://m.me/j/XyZ7wV5uTsR3qP1o/",
        memberCount: 88,
        messageFrequencyDaily: 15,
        status: "Active",
        country,
        language,
        tags: ["saas", "developers"],
        createdAt: new Date(),
      },
    ]
  }

  public async saveLink(link: DiscoveredMessengerLink, collectionId?: string): Promise<SavedMessengerLink> {
    const saved: SavedMessengerLink = {
      id: `sl-${Date.now()}`,
      discoveredLink: link,
      collectionId,
      isFavorite: false,
      savedAt: new Date(),
    }
    return this.savedLinkRepository.save(saved)
  }

  public async toggleFavorite(id: string): Promise<SavedMessengerLink> {
    const saved = await this.savedLinkRepository.findById(id)
    if (!saved) {
      throw new NotFoundException("Saved messenger link not found.")
    }
    saved.isFavorite = !saved.isFavorite
    return this.savedLinkRepository.save(saved)
  }

  public async getSavedLinks(): Promise<SavedMessengerLink[]> {
    return this.savedLinkRepository.findAll()
  }

  public async getHistory(): Promise<LinkSearchHistory[]> {
    return this.searchHistoryRepository.findAll()
  }
}
