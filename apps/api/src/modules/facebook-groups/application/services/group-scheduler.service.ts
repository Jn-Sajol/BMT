import { Injectable, NotFoundException } from "@nestjs/common"
import { GroupScheduleRepository } from "../../infrastructure/group-schedule.repository"
import { GroupSchedule } from "../../domain/group-schedule.model"

@Injectable()
export class GroupSchedulerService {
  constructor(private readonly groupScheduleRepository: GroupScheduleRepository) {}

  public async schedulePostToGroups(
    postId: string,
    groupIds: string[],
    scheduledAt: Date,
    delayMinutes: 5 | 8 | 10 | 15
  ): Promise<GroupSchedule> {
    const schedule: GroupSchedule = {
      id: `gsch-${Date.now()}`,
      postId,
      groupIds,
      status: "Pending",
      retryCount: 0,
      delayMinutes,
      scheduledAt,
    }
    return this.groupScheduleRepository.save(schedule)
  }

  public async cancelSchedule(postId: string): Promise<void> {
    const sched = await this.groupScheduleRepository.findByPostId(postId)
    if (!sched) {
      throw new NotFoundException("Active group schedule not found to cancel.")
    }
    sched.status = "Cancelled"
    await this.groupScheduleRepository.save(sched)
  }

  public async getQueue(): Promise<GroupSchedule[]> {
    return this.groupScheduleRepository.findAll()
  }
}
