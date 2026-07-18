import { Injectable, NotFoundException } from "@nestjs/common"
import { LandingPageRepository } from "../../infrastructure/landing-page.repository"
import { LandingPage, LandingPageSection } from "../../domain/landing-page.model"

@Injectable()
export class LandingPageService {
  constructor(private readonly landingPageRepository: LandingPageRepository) {}

  public async getPages(): Promise<LandingPage[]> {
    return this.landingPageRepository.findAll()
  }

  public async getPageById(id: string): Promise<LandingPage> {
    const page = await this.landingPageRepository.findById(id)
    if (!page) {
      throw new NotFoundException("Landing page not found.")
    }
    return page
  }

  public async createLandingPage(
    name: string,
    category: string,
    sections: LandingPageSection[],
    adSlots: string[]
  ): Promise<LandingPage> {
    const page: LandingPage = {
      id: `lp-${Date.now()}`,
      name,
      category,
      sections,
      adSlots,
      status: "DRAFT",
      createdAt: new Date(),
    }
    return this.landingPageRepository.save(page)
  }

  public async publishLandingPage(id: string): Promise<LandingPage> {
    const page = await this.getPageById(id)
    page.status = "PUBLISHED"
    page.publishedAt = new Date()
    return this.landingPageRepository.save(page)
  }
}
