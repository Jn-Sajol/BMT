import { Module } from "@nestjs/common"
import { MessengerLinkController } from "./presentation/messenger-link.controller"
import { LinkSearchService } from "./application/services/link-search.service"
import { LinkCollectionService } from "./application/services/link-collection.service"
import { SavedLinkRepository } from "./infrastructure/saved-link.repository"
import { SearchHistoryRepository } from "./infrastructure/search-history.repository"
import { LinkCollectionRepository } from "./infrastructure/link-collection.repository"

@Module({
  controllers: [MessengerLinkController],
  providers: [
    LinkSearchService,
    LinkCollectionService,
    SavedLinkRepository,
    SearchHistoryRepository,
    LinkCollectionRepository,
  ],
  exports: [
    LinkSearchService,
    LinkCollectionService,
    SavedLinkRepository,
    SearchHistoryRepository,
    LinkCollectionRepository,
  ],
})
export class MessengerLinkModule {}
