import { Injectable, NotFoundException } from "@nestjs/common"
import { ClickableImageRepository } from "../../infrastructure/clickable-image.repository"
import { ClickableImage } from "../../domain/clickable-image.model"

@Injectable()
export class ClickableImageService {
  constructor(private readonly clickableImageRepository: ClickableImageRepository) {}

  public async getImages(): Promise<ClickableImage[]> {
    return this.clickableImageRepository.findAll()
  }

  public async createImage(imageUrl: string, destinationUrl: string): Promise<ClickableImage> {
    const item: ClickableImage = {
      id: `img-${Date.now()}`,
      imageUrl,
      destinationUrl,
      clickCount: 0,
      createdAt: new Date(),
    }
    return this.clickableImageRepository.save(item)
  }

  public async registerClick(id: string): Promise<string> {
    const img = await this.clickableImageRepository.findById(id)
    if (!img) {
      throw new NotFoundException("Clickable image map index not found.")
    }
    img.clickCount += 1
    await this.clickableImageRepository.save(img)
    return img.destinationUrl
  }
}
