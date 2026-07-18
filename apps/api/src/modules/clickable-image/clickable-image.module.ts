import { Module } from "@nestjs/common"
import { ClickableImageController } from "./presentation/clickable-image.controller"
import { ClickableImageService } from "./application/services/clickable-image.service"
import { ClickableImageRepository } from "./infrastructure/clickable-image.repository"

@Module({
  controllers: [ClickableImageController],
  providers: [ClickableImageService, ClickableImageRepository],
  exports: [ClickableImageService, ClickableImageRepository],
})
export class ClickableImageModule {}
