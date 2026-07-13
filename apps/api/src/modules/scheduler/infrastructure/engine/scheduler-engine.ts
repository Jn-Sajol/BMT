import { Injectable, Inject, Optional, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { IScheduler } from '../../application/ports/scheduler.interface';
import { IJobWorker } from '../../application/ports/job-worker.interface';
import { JobRepository } from '../../../../infrastructure/database/repositories/job.repository';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { CLOCK_PROVIDER } from '../../../../infrastructure/security/security.module';
import * as crypto from 'crypto';

@Injectable()
export class SchedulerEngine implements IScheduler, OnModuleInit, OnModuleDestroy {
  private intervalId: NodeJS.Timeout | null = null;
  private readonly instanceId = crypto.randomUUID();

  constructor(
    private readonly jobRepo: JobRepository,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
    @Optional()
    @Inject('JOB_WORKERS')
    private readonly workers: IJobWorker[] = [],
  ) {}

  onModuleInit() {
    this.start();
  }

  onModuleDestroy() {
    this.stop();
  }

  start(): void {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.tick(), 5000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async tick(): Promise<void> {
    const lockKey = 'scheduler_engine_lock';
    const acquired = await this.jobRepo.acquireLock(lockKey, this.instanceId, 10);
    if (!acquired) {
      return;
    }

    try {
      const now = this.clockProvider.now();
      const pendingJobs = await this.jobRepo.findPendingJobs(now);

      for (const job of pendingJobs) {
        await this.runJob(job);
      }
    } catch (e) {
      // Log tick error
    } finally {
      await this.jobRepo.releaseLock(lockKey, this.instanceId);
    }
  }

  private async runJob(job: any): Promise<void> {
    const startedAt = this.clockProvider.now();
    const attempt = job.attempts + 1;

    try {
      await this.jobRepo.updateJobStatus(
        job.id,
        'RUNNING',
        attempt,
        null,
        job.runAt,
        startedAt,
      );

      const targetWorkers = this.workers.filter((w) => w.supports(job.name, job.provider));
      if (targetWorkers.length === 0) {
        throw new Error(`No worker registered to handle job: ${job.name} for provider: ${job.provider}`);
      }

      for (const worker of targetWorkers) {
        await worker.execute(job.payload, job.correlationId);
      }

      const finishedAt = this.clockProvider.now();
      const duration = finishedAt.getTime() - startedAt.getTime();

      await this.jobRepo.insertHistory(
        job.id,
        'COMPLETED',
        attempt,
        null,
        duration,
        startedAt,
        finishedAt,
      );

      if (job.cron) {
        const nextRun = new Date(finishedAt.getTime() + 60 * 60 * 1000);
        await this.jobRepo.updateJobStatus(job.id, 'PENDING', 0, null, nextRun, finishedAt);
      } else {
        await this.jobRepo.updateJobStatus(job.id, 'COMPLETED', attempt, null, job.runAt, finishedAt);
      }
    } catch (err: any) {
      const finishedAt = this.clockProvider.now();
      const duration = finishedAt.getTime() - startedAt.getTime();

      await this.jobRepo.insertHistory(
        job.id,
        'FAILED',
        attempt,
        err.message,
        duration,
        startedAt,
        finishedAt,
      );

      if (attempt >= job.maxAttempts) {
        await this.jobRepo.updateJobStatus(
          job.id,
          'FAILED',
          attempt,
          `Max attempts exceeded. Last error: ${err.message}`,
          job.runAt,
          finishedAt,
        );
      } else {
        const backoffDelay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        const nextRun = new Date(finishedAt.getTime() + backoffDelay);

        await this.jobRepo.updateJobStatus(
          job.id,
          'PENDING',
          attempt,
          err.message,
          nextRun,
          finishedAt,
        );
      }
    }
  }
}
