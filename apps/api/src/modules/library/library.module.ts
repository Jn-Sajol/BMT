import { Module } from "@nestjs/common"
import { LibraryController } from "./presentation/library.controller"
import { LibraryService } from "./application/services/library.service"
import { LibraryRepository } from "./infrastructure/library.repository"

@Module({
  controllers: [LibraryController],
  providers: [LibraryService, LibraryRepository],
  exports: [LibraryService, LibraryRepository],
})
export class LibraryModule {}
