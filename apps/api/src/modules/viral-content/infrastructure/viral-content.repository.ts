import { Injectable } from "@nestjs/common"
import { ViralContentResult } from "../domain/viral-search.model"

@Injectable()
export class ViralContentRepository {
  private cache: ViralContentResult[] = [
    {
      id: "v-1",
      title: "10 Mindblowing Marketing Automation Hacks",
      platform: "youtube",
      url: "https://youtube.com/watch?v=1",
      likesCount: 15400,
      commentCount: 840,
      shareCount: 1200,
      engagementScore: 92,
      category: "Marketing",
      country: "USA",
    },
    {
      id: "v-2",
      title: "Why Traditional Ads Are Dead",
      platform: "facebook",
      url: "https://facebook.com/watch/2",
      likesCount: 4500,
      commentCount: 310,
      shareCount: 450,
      engagementScore: 84,
      category: "Advertising",
      country: "UK",
    },
  ]

  public async search(
    platform: string,
    category?: string,
    country?: string
  ): Promise<ViralContentResult[]> {
    let filtered = this.cache.filter((item) => item.platform === platform)
    if (category) {
      filtered = filtered.filter((item) => item.category.toLowerCase() === category.toLowerCase())
    }
    if (country) {
      filtered = filtered.filter((item) => item.country.toLowerCase() === country.toLowerCase())
    }
    return filtered
  }
}
