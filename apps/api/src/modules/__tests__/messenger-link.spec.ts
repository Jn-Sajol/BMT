import { SavedLinkRepository } from "../messenger-link/infrastructure/saved-link.repository"
import { SearchHistoryRepository } from "../messenger-link/infrastructure/search-history.repository"
import { LinkSearchService } from "../messenger-link/application/services/link-search.service"
import { LinkCollectionRepository } from "../messenger-link/infrastructure/link-collection.repository"
import { LinkCollectionService } from "../messenger-link/application/services/link-collection.service"
import { MessengerLinkController } from "../messenger-link/presentation/messenger-link.controller"

describe("Messenger Link Finder (F-33) Unit Tests", () => {
  it("should search group details and extract invite links, save them, toggle favorites, configure custom collections directories, and log history reviews", async () => {
    const savedRepo = new SavedLinkRepository()
    const historyRepo = new SearchHistoryRepository()
    const colRepo = new LinkCollectionRepository()

    const searchService = new LinkSearchService(savedRepo, historyRepo)
    const colService = new LinkCollectionService(colRepo)

    const controller = new MessengerLinkController(searchService, colService)

    // 1. Search Discovered Links list
    const list = await controller.search("E-Commerce", "US", "en")
    expect(list.length).toBe(2)
    expect(list[0].groupName).toBe("Dropshipping Mastermind Chat")
    expect(list[0].inviteUrl).toContain("m.me/j/")

    // 2. Save Link
    const saved = await controller.saveLink(list[0], undefined)
    expect(saved.discoveredLink.groupId).toBe("9001")
    expect(saved.isFavorite).toBe(false)

    // 3. Toggle Favorite
    const fav = await controller.favorite(saved.id)
    expect(fav.isFavorite).toBe(true)

    // 4. Collections manager CRUD
    const col = await controller.createCollection("Target Chats Leads")
    expect(col.name).toBe("Target Chats Leads")

    const renamed = await controller.renameCollection(col.id, "Dropshipping Chats")
    expect(renamed.name).toBe("Dropshipping Chats")

    const colsList = await colService.getCollections()
    expect(colsList.length).toBe(1)

    await controller.deleteCollection(col.id)
    const listAfterDelete = await colService.getCollections()
    expect(listAfterDelete.length).toBe(0)

    // 5. Search history and statistics
    const history = await controller.getHistory()
    expect(history.length).toBe(1)
    expect(history[0].keyword).toBe("E-Commerce")

    const stats = await controller.getStatistics()
    expect(stats.savedGroups).toBe(1)
    expect(stats.favoriteGroups).toBe(1)
  })
})
