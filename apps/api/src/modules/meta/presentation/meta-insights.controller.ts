import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { MetaInsightsService } from '../application/services/meta-insights.service';
import { MetaInsightsSyncService } from '../application/services/meta-insights-sync.service';
import {
  SyncInsightsDto,
  CampaignInsightResponseDto,
  AdSetInsightResponseDto,
  AdInsightResponseDto,
  SyncHistoryResponseDto,
} from '../application/services/meta-insights.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@ApiTags('Meta Insights & Performance')
@Controller({ path: 'meta/insights', version: '1' })
@UseGuards(AuthGuard)
export class MetaInsightsController {
  constructor(
    private readonly insightsService: MetaInsightsService,
    private readonly syncService: MetaInsightsSyncService,
  ) {}

  @Post('sync')
  @ApiOperation({ summary: 'Synchronize Meta insights metrics' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async sync(
    @Body() dto: SyncInsightsDto,
    @Req() req: any,
  ): Promise<SyncHistoryResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.syncService.sync(dto, workspaceId);
  }

  @Get('campaigns')
  @ApiOperation({ summary: 'Retrieve Campaign Performance Insights' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getCampaigns(@Req() req: any): Promise<CampaignInsightResponseDto[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.insightsService.getCampaignInsights(workspaceId);
  }

  @Get('adsets')
  @ApiOperation({ summary: 'Retrieve AdSet Performance Insights' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getAdSets(@Req() req: any): Promise<AdSetInsightResponseDto[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.insightsService.getAdSetInsights(workspaceId);
  }

  @Get('ads')
  @ApiOperation({ summary: 'Retrieve Ad Performance Insights' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getAds(@Req() req: any): Promise<AdInsightResponseDto[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.insightsService.getAdInsights(workspaceId);
  }
}
