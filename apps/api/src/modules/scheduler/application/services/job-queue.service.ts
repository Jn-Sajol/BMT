import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IJobQueue } from '../ports/job-queue.interface';
import { JobRepository } from '../../../../infrastructure/database/repositories/job.repository';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { CLOCK_PROVIDER } from '../../../../infrastructure/security/security.module';
import * as crypto from 'crypto';

@Injectable()
export class JobQueue implements IJobQueue {
  constructor(
    private readonly jobRepo: JobRepository,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
  ) {}

  async enqueue(
    name: string,
    provider: string,
    payload: any,
    correlationId?: string,
    runAt?: Date,
  ): Promise<string> {
    const finalId = correlationId || crypto.randomUUID();
    const finalRunAt = runAt || this.clockProvider.now();

    const job = await this.jobRepo.createJob(
      name,
      provider,
      payload,
      null,
      finalId,
      finalRunAt,
    );

    return job.id;
  }

  async enqueueCron(
    name: string,
    provider: string,
    payload: any,
    cron: string,
    correlationId?: string,
  ): Promise<string> {
    const finalId = correlationId || crypto.randomUUID();

    const job = await this.jobRepo.createJob(
      name,
      provider,
      payload,
      cron,
      finalId,
      this.clockProvider.now(),
    );

    return job.id;
  }

  async cancel(jobId: string): Promise<void> {
    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found.`);
    }

    await this.jobRepo.cancelJob(jobId);
  }

  async triggerManual(jobId: string): Promise<void> {
    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found.`);
    }

    await this.jobRepo.updateJobStatus(
      jobId,
      'PENDING',
      job.attempts,
      null,
      this.clockProvider.now(),
      job.lastRunAt,
    );
  }
}
