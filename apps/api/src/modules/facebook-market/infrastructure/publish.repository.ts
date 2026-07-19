import { Injectable } from "@nestjs/common"
import { PostSchedule } from "../domain/schedule.model"

@Injectable()
export class PublishRepository {
  private queue: PostSchedule[] = []

  public async addToQueue(schedule: PostSchedule): Promise<PostSchedule> {
    this.queue.push(schedule)
    return schedule
  }

  public async getQueue(): Promise<PostSchedule[]> {
    return this.queue
  }
}
