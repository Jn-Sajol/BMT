import { Controller, Get, Post, Query, UseGuards, HttpStatus, HttpCode, Inject } from '@nestjs/common';
import { ProjectionService } from '../application/services/projection.service';
import { PRISMA_CLIENT } from '../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../infrastructure/database/prisma-extensions';
import { AuthGuard } from '../../../../common/guards/auth.guard';

@Controller('api/automation/analytics')
@UseGuards(AuthGuard)
export class AnalyticsController {
  constructor(
    private readonly projectionService: ProjectionService,
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  @Get('timeline')
  async getTimeline(@Query('workspaceId') workspaceId: string) {
    return await this.prisma.automationTimelineEvent.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('rule-performance')
  async getRulePerformance(@Query('workspaceId') workspaceId: string) {
    return await this.prisma.automationRulePerformanceProjection.findMany({
      where: { workspaceId },
      orderBy: { executionsCount: 'desc' },
    });
  }

  @Get('action-performance')
  async getActionPerformance(@Query('workspaceId') workspaceId: string) {
    return await this.prisma.automationActionPerformanceProjection.findMany({
      where: { workspaceId },
      orderBy: { executionsCount: 'desc' },
    });
  }

  @Get('trigger-performance')
  async getTriggerPerformance(@Query('workspaceId') workspaceId: string) {
    return await this.prisma.automationTriggerPerformanceProjection.findMany({
      where: { workspaceId },
      orderBy: { matchedCount: 'desc' },
    });
  }

  @Get('execution-performance')
  async getExecutionPerformance(@Query('workspaceId') workspaceId: string) {
    return await this.prisma.automationExecutionPerformanceProjection.findMany({
      where: { workspaceId },
      orderBy: { startedAt: 'desc' },
    });
  }

  @Get('aggregates')
  async getAggregates(
    @Query('workspaceId') workspaceId: string,
    @Query('period') period?: string,
  ) {
    return await this.prisma.automationAggregatedStats.findMany({
      where: {
        workspaceId,
        period: period || 'DAILY',
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  @Post('rebuild')
  @HttpCode(HttpStatus.OK)
  async rebuildProjections(@Query('workspaceId') workspaceId: string) {
    await this.projectionService.rebuildProjections(workspaceId);
    return { status: 'SUCCESS', message: 'Projections rebuilt successfully.' };
  }
}
