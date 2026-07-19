import { Injectable } from "@nestjs/common"
import { PostSchedule } from "../domain/schedule.model"

@Injectable()
export class ScheduleRepository {
  private schedules: PostSchedule[] = []

  public async save(schedule: PostSchedule): Promise<PostSchedule> {
    const idx = this.schedules.findIndex((s) => s.id === schedule.id)
    if (idx >= 0) {
      this.schedules[idx] = schedule
    } else {
      this.schedules.push(schedule)
    }
    return schedule
  }

  public async findByPostId(postId: string): Promise<PostSchedule | null> {
    return this.schedules.find((s) => s.postId === postId) || null
  }

  public async findById(id: string): Promise<PostSchedule | null> {
    return this.schedules.find((s) => s.id === id) || null
  }

  public async findAll(): Promise<PostSchedule[]> {
    return this.schedules
  }
}
