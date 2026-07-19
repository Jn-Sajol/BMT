import { Injectable } from "@nestjs/common"
import { SavedMessengerLink } from "../domain/messenger-link.model"

@Injectable()
export class SavedLinkRepository {
  private savedLinks: SavedMessengerLink[] = []

  public async save(link: SavedMessengerLink): Promise<SavedMessengerLink> {
    const idx = this.savedLinks.findIndex((l) => l.id === link.id)
    if (idx >= 0) {
      this.savedLinks[idx] = link
    } else {
      this.savedLinks.push(link)
    }
    return link
  }

  public async findById(id: string): Promise<SavedMessengerLink | null> {
    return this.savedLinks.find((l) => l.id === id) || null
  }

  public async findAll(): Promise<SavedMessengerLink[]> {
    return this.savedLinks
  }
}
