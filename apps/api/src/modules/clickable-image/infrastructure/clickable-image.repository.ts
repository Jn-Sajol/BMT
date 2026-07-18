import { Injectable } from "@nestjs/common"
import { ClickableImage } from "../domain/clickable-image.model"

@Injectable()
export class ClickableImageRepository {
  private items: ClickableImage[] = []

  public async save(item: ClickableImage): Promise<ClickableImage> {
    const idx = this.items.findIndex((i) => i.id === item.id)
    if (idx >= 0) {
      this.items[idx] = item
    } else {
      this.items.push(item)
    }
    return item
  }

  public async findById(id: string): Promise<ClickableImage | null> {
    return this.items.find((i) => i.id === id) || null
  }

  public async findAll(): Promise<ClickableImage[]> {
    return this.items
  }
}
