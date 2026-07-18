import { Module } from "@nestjs/common"
import { ViralContentController } from "./presentation/viral-content.controller"
import { ViralContentService } from "./application/services/viral-content.service"
import { ViralContentRepository } from "./infrastructure/viral-content.repository"

@Module({
  controllers: [ViralContentController],
  providers: [ViralContentService, ViralContentRepository],
  exports: [ViralContentService, ViralContentRepository],
})
export class ViralContentModule {}
