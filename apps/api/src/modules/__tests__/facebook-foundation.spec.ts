import { LibraryService } from "../library/application/services/library.service"
import { LibraryRepository } from "../library/infrastructure/library.repository"
import { LibraryController } from "../library/presentation/library.controller"

import { ClickableImageService } from "../clickable-image/application/services/clickable-image.service"
import { ClickableImageRepository } from "../clickable-image/infrastructure/clickable-image.repository"
import { ClickableImageController } from "../clickable-image/presentation/clickable-image.controller"

import { LandingPageService } from "../landing-page/application/services/landing-page.service"
import { LandingPageRepository } from "../landing-page/infrastructure/landing-page.repository"
import { LandingPageController } from "../landing-page/presentation/landing-page.controller"

import { ViralContentService } from "../viral-content/application/services/viral-content.service"
import { ViralContentRepository } from "../viral-content/infrastructure/viral-content.repository"
import { ViralContentController } from "../viral-content/presentation/viral-content.controller"

import { DownloaderService } from "../downloader/application/services/downloader.service"
import { DownloaderRepository } from "../downloader/infrastructure/downloader.repository"
import { DownloaderController } from "../downloader/presentation/downloader.controller"

import { DashboardService } from "../dashboard/application/services/dashboard.service"
import { DashboardStatsRepository } from "../dashboard/infrastructure/dashboard-stats.repository"
import { DashboardController } from "../dashboard/presentation/dashboard.controller"

describe("Facebook Marketing Foundation (F-22) Unit Tests", () => {
  // 1. Library Module
  it("should verify library item CRUD logic", async () => {
    const repo = new LibraryRepository()
    const service = new LibraryService(repo)
    const controller = new LibraryController(service)

    const upload = await controller.uploadItem("Promo Photo", "image", "Fashion", "http://url.jpg", undefined, 2048)
    expect(upload.name).toBe("Promo Photo")
    expect(upload.type).toBe("image")

    const list = await controller.listItems("Fashion")
    expect(list.length).toBe(1)
    expect(list[0].id).toBe(upload.id)
  })

  // 2. Clickable Image Module
  it("should verify clickable image generation and click tracking", async () => {
    const repo = new ClickableImageRepository()
    const service = new ClickableImageService(repo)
    const controller = new ClickableImageController(service)

    const img = await controller.create("http://img.png", "https://destination.com")
    expect(img.destinationUrl).toBe("https://destination.com")

    const dest = await service.registerClick(img.id)
    expect(dest).toBe("https://destination.com")
  })

  // 3. Landing Page Module
  it("should verify landing page create, preview and publish steps", async () => {
    const repo = new LandingPageRepository()
    const service = new LandingPageService(repo)
    const controller = new LandingPageController(service)

    const lp = await controller.create("Spring Collection", "Fashion", [{ title: "Hero", content: "Buy Now" }], ["<div>Ad</div>"])
    expect(lp.status).toBe("DRAFT")

    const preview = await controller.preview(lp.id)
    expect(preview.name).toBe("Spring Collection")

    const pub = await controller.publish(lp.id)
    expect(pub.status).toBe("PUBLISHED")
    expect(pub.publishedAt).toBeDefined()
  })

  // 4. Viral Content Module
  it("should query viral search results with metrics", async () => {
    const repo = new ViralContentRepository()
    const service = new ViralContentService(repo)
    const controller = new ViralContentController(service)

    const results = await controller.search("youtube", undefined, undefined, "USA", "Marketing", undefined, undefined)
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].likesCount).toBe(15400)
  })

  // 5. Downloader Module
  it("should trigger raw video downloads and save download logs", async () => {
    const repo = new DownloaderRepository()
    const service = new DownloaderService(repo)
    const controller = new DownloaderController(service)

    const file = await controller.download("https://youtube.com/watch?v=cool", "youtube")
    expect(file.platform).toBe("youtube")
    expect(file.localFilePath).toBeDefined()
  })

  // 6. Dashboard Module
  it("should aggregate stats correctly from library, image, page, and downloader modules", async () => {
    const libraryRepo = new LibraryRepository()
    const clickableRepo = new ClickableImageRepository()
    const landingRepo = new LandingPageRepository()
    const downloaderRepo = new DownloaderRepository()

    const dashboardRepo = new DashboardStatsRepository()
    const dashboardService = new DashboardService(
      dashboardRepo,
      libraryRepo,
      clickableRepo,
      landingRepo,
      downloaderRepo
    )
    const controller = new DashboardController(dashboardService)

    // Seed dummy data
    await libraryRepo.save({
      id: "lib-1",
      name: "Mock text",
      type: "text",
      category: "General",
      createdAt: new Date(),
    })

    const metrics = await controller.getMetrics()
    expect(metrics.totalLibraryItemsCount).toBe(1)
    expect(metrics.totalClickableImagesCount).toBe(0)
    expect(metrics.futureReadyFields).toBeDefined()
  })
})
