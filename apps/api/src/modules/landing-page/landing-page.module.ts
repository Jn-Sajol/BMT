import { Module } from "@nestjs/common"
import { LandingPageController } from "./presentation/landing-page.controller"
import { LandingPageService } from "./application/services/landing-page.service"
import { LandingPageRepository } from "./infrastructure/landing-page.repository"

@Module({
  controllers: [LandingPageController],
  providers: [LandingPageService, LandingPageRepository],
  exports: [LandingPageService, LandingPageRepository],
})
export class LandingPageModule {}
