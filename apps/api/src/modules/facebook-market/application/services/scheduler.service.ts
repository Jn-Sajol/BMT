import { Injectable, NotFoundException } from "@nestjs/common"
import { ScheduleRepository } from "../../infrastructure/schedule.repository"
import { MasterPostRepository } from "../../infrastructure/master-post.repository"
import { PostSchedule } from "../../domain/schedule.model"

@Injectable()
export class SchedulerService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly masterPostRepository: MasterPostRepository
  ) {}

  public async schedulePost(postId: string, scheduledAt: Date): Promise<PostSchedule> {
    const post = await this.masterPostRepository.findById(postId)
    if (!post) {
      throw new NotFoundException("Master Post not found to schedule.")
    }
    post.status = "Scheduled"
    post.scheduledAt = scheduledAt
    await this.masterPostRepository.save(post)

    const schedule: PostSchedule = {
      id: `sched-${Date.now()}`,
      postId,
      status: "Pending",
      retryCount: 0,
      scheduledAt,
    }
    return this.scheduleRepository.save(schedule)
  }

  public async cancelSchedule(postId: string): Promise<void> {
    const post = await this.masterPostRepository.findById(postId)
    if (!post) {
      throw new NotFoundException("Master Post not found to cancel.")
    }
    post.status = "Cancelled"
    await this.masterPostRepository.save(post)

    const sched = await this.scheduleRepository.findByPostId(postId)
    if (sched) {
      sched.status = "Cancelled"
      await this.scheduleRepository.save(sched)
    }
  }

  public async getQueue(): Promise<PostSchedule[]> {
    return this.scheduleRepository.findAll()
  }
}
