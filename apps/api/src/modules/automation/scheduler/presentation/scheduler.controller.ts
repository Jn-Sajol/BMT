import { Controller, Get, Post, Body, UseGuards, Inject, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { SchedulerEngine } from '../application/services/scheduler-engine.service';
import { SchedulerLoop } from '../application/services/scheduler-loop.service';
import { PRISMA_CLIENT } from '../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../infrastructure/database/prisma-extensions';
import { AuthGuard } from '../../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@ApiTags('Scheduler Engine')
@Controller('api/automation/schedules')
@UseGuards(AuthGuard)
export class SchedulerController {
  constructor(
    private readonly engine: SchedulerEngine,
    private readonly loop: SchedulerLoop,
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get active/paused rules schedules' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getSchedules(@Req() req: any) {
    const workspaceId = req.headers['x-workspace-id'];
    return await this.prisma.automationSchedule.findMany({
      where: { workspaceId },
    });
  }

  @Get('history')
  @ApiOperation({ summary: 'Get execution history audit records' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getHistory(@Req() req: any) {
    const workspaceId = req.headers['x-workspace-id'];
    return await this.prisma.automationScheduleExecution.findMany({
      where: { workspaceId },
      orderBy: { startedAt: 'desc' },
    });
  }

  @Post('run-now')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manually trigger rules schedule execution instantly' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async runNow(@Body('scheduleId') scheduleId: string) {
    const nodeId = this.loop.getNodeId();
    await this.engine.triggerSchedule(scheduleId, nodeId);
    return { success: true, triggeredBy: nodeId };
  }

  @Post('pause')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pause automated execution for schedule' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async pauseSchedule(@Body('scheduleId') scheduleId: string) {
    await this.engine.pauseSchedule(scheduleId);
    return { status: 'PAUSED' };
  }

  @Post('resume')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resume schedule active evaluations' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async resumeSchedule(@Body('scheduleId') scheduleId: string) {
    await this.engine.resumeSchedule(scheduleId);
    return { status: 'ACTIVE' };
  }

  @Get('health')
  @ApiOperation({ summary: 'Query cluster scheduler health node state' })
  async checkHealth() {
    const activeNodesCount = await this.prisma.automationSchedulerNode.count({
      where: { status: 'ACTIVE' },
    });
    return {
      status: 'healthy',
      currentNodeId: this.loop.getNodeId(),
      clusterSize: activeNodesCount,
    };
  }
}
