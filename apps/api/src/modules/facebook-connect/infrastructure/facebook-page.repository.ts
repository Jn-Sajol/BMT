import { Injectable } from "@nestjs/common"
import { FacebookPage } from "../domain/facebook-page.model"

@Injectable()
export class FacebookPageRepository {
  private pages: FacebookPage[] = []

  public async save(page: FacebookPage): Promise<FacebookPage> {
    const idx = this.pages.findIndex((p) => p.id === page.id)
    if (idx >= 0) {
      this.pages[idx] = page
    } else {
      this.pages.push(page)
    }
    return page
  }

  public async findByAccountId(accountId: string): Promise<FacebookPage[]> {
    return this.pages.filter((p) => p.accountId === accountId)
  }

  public async findById(id: string): Promise<FacebookPage | null> {
    return this.pages.find((p) => p.id === id) || null
  }

  public async findAll(): Promise<FacebookPage[]> {
    return this.pages
  }

  public async remove(id: string): Promise<void> {
    this.pages = this.pages.filter((p) => p.id !== id)
  }
}
