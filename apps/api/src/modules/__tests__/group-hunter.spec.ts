import { SavedGroupRepository } from "../group-hunter/infrastructure/saved-group.repository"
import { SearchHistoryRepository } from "../group-hunter/infrastructure/search-history.repository"
import { GroupSearchService } from "../group-hunter/application/services/group-search.service"
import { GroupCollectionRepository } from "../group-hunter/infrastructure/group-collection.repository"
import { GroupCollectionService } from "../group-hunter/application/services/group-collection.service"
import { GroupHunterController } from "../group-hunter/presentation/group-hunter.controller"

describe("FB Group Hunter (F-32) Unit Tests", () => {
  it("should search group details, save, add favorite, CRUD collections directories, and log history reviews", async () => {
    const savedRepo = new SavedGroupRepository()
    const historyRepo = new SearchHistoryRepository()
    const colRepo = new GroupCollectionRepository()

    const searchService = new GroupSearchService(savedRepo, historyRepo)
    const colService = new GroupCollectionService(colRepo)

    const controller = new GroupHunterController(searchService, colService)

    // 1. Search Discovered Groups list
    const list = await controller.search("E-Commerce", "US", "en")
    expect(list.length).toBe(2)
    expect(list[0].name).toBe("Shopify Dropshipping Beginners Hub")

    // 2. Save group
    const saved = await controller.saveGroup(list[0], undefined)
    expect(saved.discoveredGroup.groupId).toBe("8001")
    expect(saved.isFavorite).toBe(false)

    // 3. Toggle Favorite
    const fav = await controller.favorite(saved.id)
    expect(fav.isFavorite).toBe(true)

    // 4. Collections manager CRUD
    const col = await controller.createCollection("Target SaaS Leads")
    expect(col.name).toBe("Target SaaS Leads")

    const renamed = await controller.renameCollection(col.id, "Target Dropshipping Leads")
    expect(renamed.name).toBe("Target Dropshipping Leads")

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
