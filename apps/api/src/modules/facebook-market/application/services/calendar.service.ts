import { Injectable } from "@nestjs/common"
import { ScheduleRepository } from "../../infrastructure/schedule.repository"
import { MasterPostRepository } from "../../infrastructure/master-post.repository"

export interface CalendarEvent {
  postId: string
  title: string
  scheduledAt: Date
  status: string
}

@Injectable()
export class CalendarService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly masterPostRepository: MasterPostRepository
  ) {}

  public async getCalendarEvents(): Promise<CalendarEvent[]> {
    const schedules = await this.scheduleRepository.findAll()
    const events: CalendarEvent[] = []

    for (const s of schedules) {
      const post = await this.masterPostRepository.findById(s.postId)
      if (post) {
        events.push({
          postId: s.postId,
          title: post.title,
          scheduledAt: s.scheduledAt,
          status: s.status,
        })
      }
    }
    return events
  }
}
