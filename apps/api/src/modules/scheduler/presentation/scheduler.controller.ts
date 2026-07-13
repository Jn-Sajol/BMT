import { Controller, Post, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { JobQueue } from '../application/services/job-queue.service';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Background Job Scheduler')
@Controller({ path: 'scheduler', version: '1' })
@UseGuards(AuthGuard)
export class SchedulerController {
  constructor(private readonly jobQueue: JobQueue) {}

  @Post('jobs/:id/trigger')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manually trigger / re-run a background job' })
  async triggerJob(@Param('id') jobId: string): Promise<{ success: boolean }> {
    await this.jobQueue.triggerManual(jobId);
    return { success: true };
  }

  @Post('jobs/:id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a scheduled or pending background job' })
  async cancelJob(@Param('id') jobId: string): Promise<{ success: boolean }> {
    await this.jobQueue.cancel(jobId);
    return { success: true };
  }
}
