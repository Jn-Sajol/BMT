import { Controller, Patch, Param, Body, Req, UseGuards } from '@nestjs/common';
import { CampaignLifecycleService } from '../application/services/campaign-lifecycle.service';
import { UpdateCampaignDto, CampaignLifecycleHistoryDto } from '../application/services/campaign-lifecycle.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader, ApiBody } from '@nestjs/swagger';

@ApiTags('Campaign Lifecycle Management')
@Controller({ path: 'campaigns', version: '1' })
@UseGuards(AuthGuard)
export class CampaignLifecycleController {
  constructor(private readonly lifecycleService: CampaignLifecycleService) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Update a published Campaign attributes on Facebook' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiBody({ type: UpdateCampaignDto })
  async updateCampaign(
    @Param('id') campaignId: string,
    @Body() dto: UpdateCampaignDto,
    @Req() req: any,
  ): Promise<CampaignLifecycleHistoryDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.lifecycleService.updateCampaign(campaignId, workspaceId, userId, dto);
  }

  @Patch(':id/pause')
  @ApiOperation({ summary: 'Pause a published Campaign on Facebook' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async pauseCampaign(
    @Param('id') campaignId: string,
    @Req() req: any,
  ): Promise<CampaignLifecycleHistoryDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.lifecycleService.pauseCampaign(campaignId, workspaceId, userId);
  }

  @Patch(':id/resume')
  @ApiOperation({ summary: 'Resume a paused Campaign on Facebook' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async resumeCampaign(
    @Param('id') campaignId: string,
    @Req() req: any,
  ): Promise<CampaignLifecycleHistoryDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.lifecycleService.resumeCampaign(campaignId, workspaceId, userId);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive a published Campaign on Facebook' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async archiveCampaign(
    @Param('id') campaignId: string,
    @Req() req: any,
  ): Promise<CampaignLifecycleHistoryDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.lifecycleService.archiveCampaign(campaignId, workspaceId, userId);
  }
}
