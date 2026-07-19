import { Injectable } from "@nestjs/common"
import { GroupSchedule } from "../domain/group-schedule.model"

@Injectable()
export class GroupScheduleRepository {
  private schedules: GroupSchedule[] = []

  public async save(schedule: GroupSchedule): Promise<GroupSchedule> {
    const idx = this.schedules.findIndex((s) => s.id === schedule.id)
    if (idx >= 0) {
      this.schedules[idx] = schedule
    } else {
      this.schedules.push(schedule)
    }
    return schedule
  }

  public async findById(id: string): Promise<GroupSchedule | null> {
    return this.schedules.find((s) => s.id === id) || null
  }

  public async findByPostId(postId: string): Promise<GroupSchedule | null> {
    return this.schedules.find((s) => s.postId === postId) || null
  }

  public async findAll(): Promise<GroupSchedule[]> {
    return this.schedules
  }
}
