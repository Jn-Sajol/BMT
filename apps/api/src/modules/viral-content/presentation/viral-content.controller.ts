import { Controller, Get, Query } from "@nestjs/common"
import { ViralContentService } from "../application/services/viral-content.service"

@Controller("viral-content")
export class ViralContentController {
  constructor(private readonly viralContentService: ViralContentService) {}

  @Get("search")
  public async search(
    @Query("platform") platform: "facebook" | "youtube" | "tiktok",
    @Query("keyword") keyword?: string,
    @Query("niche") niche?: string,
    @Query("country") country?: string,
    @Query("category") category?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.viralContentService.findViralContent({
      platform,
      keyword,
      niche,
      country,
      category,
      page,
      limit,
    })
  }
}
