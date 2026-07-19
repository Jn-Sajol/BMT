import { Injectable } from "@nestjs/common"
import { MasterPostRepository } from "../../infrastructure/master-post.repository"
import { ReportRepository } from "../../infrastructure/report.repository"
import { PublishLog } from "../../domain/publish-log.model"

@Injectable()
export class PublishingService {
  constructor(
    private readonly masterPostRepository: MasterPostRepository,
    private readonly reportRepository: ReportRepository
  ) {}

  public async publishInstant(postId: string): Promise<PublishLog> {
    const post = await this.masterPostRepository.findById(postId)
    if (!post) {
      throw new Error("Master Post not found to publish.")
    }
    post.status = "Publishing"
    await this.masterPostRepository.save(post)

    console.log(`[PublishingService] Publishing post "${post.title}" to target Pages via official Graph API...`)
    
    const startTime = Date.now()
    
    // Simulate successful post
    post.status = "Published"
    await this.masterPostRepository.save(post)

    const log: PublishLog = {
      id: `log-${Date.now()}`,
      requestId: `req-${Date.now()}-fb-publish`,
      accountId: post.targets[0]?.targetId || "acc-default",
      pageId: post.targets[0]?.type === "Page" ? post.targets[0].targetId : undefined,
      publishTime: new Date(),
      facebookPostId: `fb-post-${Date.now()}`,
      status: "success",
      executionDurationMs: Date.now() - startTime,
    }
    await this.reportRepository.save(log)
    return log
  }
}
