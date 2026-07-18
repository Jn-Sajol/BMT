import { Injectable } from "@nestjs/common"
import { LandingPage } from "../domain/landing-page.model"

@Injectable()
export class LandingPageRepository {
  private pages: LandingPage[] = []

  public async save(page: LandingPage): Promise<LandingPage> {
    const idx = this.pages.findIndex((p) => p.id === page.id)
    if (idx >= 0) {
      this.pages[idx] = page
    } else {
      this.pages.push(page)
    }
    return page
  }

  public async findById(id: string): Promise<LandingPage | null> {
    return this.pages.find((p) => p.id === id) || null
  }

  public async findAll(): Promise<LandingPage[]> {
    return this.pages
  }
}
