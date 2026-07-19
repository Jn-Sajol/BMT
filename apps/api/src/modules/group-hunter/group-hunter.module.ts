import { Module } from "@nestjs/common"
import { GroupHunterController } from "./presentation/group-hunter.controller"
import { GroupSearchService } from "./application/services/group-search.service"
import { GroupCollectionService } from "./application/services/group-collection.service"
import { SavedGroupRepository } from "./infrastructure/saved-group.repository"
import { SearchHistoryRepository } from "./infrastructure/search-history.repository"
import { GroupCollectionRepository } from "./infrastructure/group-collection.repository"

@Module({
  controllers: [GroupHunterController],
  providers: [
    GroupSearchService,
    GroupCollectionService,
    SavedGroupRepository,
    SearchHistoryRepository,
    GroupCollectionRepository,
  ],
  exports: [
    GroupSearchService,
    GroupCollectionService,
    SavedGroupRepository,
    SearchHistoryRepository,
    GroupCollectionRepository,
  ],
})
export class GroupHunterModule {}
