import { Controller, Get, Post, Body, UseGuards, Inject, Req } from '@nestjs/common';
import { InsightsCollectionEngine } from '../application/services/insights-collection-engine.service';
import { PRISMA_CLIENT } from '../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../infrastructure/database/prisma-extensions';
import { AuthGuard } from '../../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@ApiTags('Insights Collection Engine')
@Controller({ path: 'insights', version: '1' })
@UseGuards(AuthGuard)
export class InsightsController {
  constructor(
    private readonly engine: InsightsCollectionEngine,
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  @Get('sync-status')
  @ApiOperation({ summary: 'Get current sync status/cursors' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getSyncStatus(@Req() req: any) {
    const workspaceId = req.headers['x-workspace-id'];
    return await this.prisma.automationInsightsSyncCursor.findMany({
      where: { workspaceId },
    });
  }

  @Post('full-sync')
  @ApiOperation({ summary: 'Trigger full metrics sync run' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async fullSync(@Body('provider') provider: string, @Req() req: any) {
    const workspaceId = req.headers['x-workspace-id'];
    return await this.engine.triggerSync(workspaceId, provider, 'FULL_SYNC');
  }

  @Post('incremental-sync')
  @ApiOperation({ summary: 'Trigger incremental metrics sync run' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async incrementalSync(@Body('provider') provider: string, @Req() req: any) {
    const workspaceId = req.headers['x-workspace-id'];
    return await this.engine.triggerSync(workspaceId, provider, 'INCREMENTAL_SYNC');
  }

  @Post('backfill')
  @ApiOperation({ summary: 'Trigger historical metrics backfill run' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async backfill(@Body('provider') provider: string, @Req() req: any) {
    const workspaceId = req.headers['x-workspace-id'];
    return await this.engine.triggerSync(workspaceId, provider, 'HISTORICAL_BACKFILL');
  }

  @Get('history')
  @ApiOperation({ summary: 'Get sync runs audit timeline' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getHistory(@Req() req: any) {
    const workspaceId = req.headers['x-workspace-id'];
    return await this.prisma.automationInsightsSyncRun.findMany({
      where: { workspaceId },
      orderBy: { startedAt: 'desc' },
    });
  }
}
