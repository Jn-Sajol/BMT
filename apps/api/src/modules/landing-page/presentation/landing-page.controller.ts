import { Controller, Get, Post, Body, Param } from "@nestjs/common"
import { LandingPageService } from "../application/services/landing-page.service"
import { LandingPageSection } from "../domain/landing-page.model"

@Controller("landing-page")
export class LandingPageController {
  constructor(private readonly landingPageService: LandingPageService) {}

  @Get()
  public async listPages() {
    return this.landingPageService.getPages()
  }

  @Get(":id")
  public async preview(@Param("id") id: string) {
    return this.landingPageService.getPageById(id)
  }

  @Post()
  public async create(
    @Body("name") name: string,
    @Body("category") category: string,
    @Body("sections") sections: LandingPageSection[],
    @Body("adSlots") adSlots: string[]
  ) {
    return this.landingPageService.createLandingPage(name, category, sections, adSlots)
  }

  @Post(":id/publish")
  public async publish(@Param("id") id: string) {
    return this.landingPageService.publishLandingPage(id)
  }
}
