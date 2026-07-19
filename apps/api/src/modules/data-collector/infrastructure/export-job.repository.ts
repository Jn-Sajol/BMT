import { Injectable } from "@nestjs/common"
import { ExportJob } from "../domain/data-collector.model"

@Injectable()
export class ExportJobRepository {
  private jobs: ExportJob[] = []

  public async save(job: ExportJob): Promise<ExportJob> {
    const idx = this.jobs.findIndex((j) => j.id === job.id)
    if (idx >= 0) {
      this.jobs[idx] = job
    } else {
      this.jobs.push(job)
    }
    return job
  }

  public async findById(id: string): Promise<ExportJob | null> {
    return this.jobs.find((j) => j.id === id) || null
  }

  public async findAll(): Promise<ExportJob[]> {
    return this.jobs
  }
}
