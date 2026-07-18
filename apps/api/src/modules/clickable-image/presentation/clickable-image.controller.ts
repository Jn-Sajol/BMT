import { Controller, Get, Post, Body, Param, Res } from "@nestjs/common"
import { Response } from "express"
import { ClickableImageService } from "../application/services/clickable-image.service"

@Controller("clickable-image")
export class ClickableImageController {
  constructor(private readonly clickableImageService: ClickableImageService) {}

  @Get()
  public async listImages() {
    return this.clickableImageService.getImages()
  }

  @Post()
  public async create(
    @Body("imageUrl") imageUrl: string,
    @Body("destinationUrl") destinationUrl: string
  ) {
    return this.clickableImageService.createImage(imageUrl, destinationUrl)
  }

  @Get(":id")
  public async redirectUser(@Param("id") id: string, @Res() res: Response) {
    const destinationUrl = await this.clickableImageService.registerClick(id)
    return res.redirect(destinationUrl)
  }
}
