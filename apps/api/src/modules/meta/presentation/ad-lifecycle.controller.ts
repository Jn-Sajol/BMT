import { Controller, Patch, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AdLifecycleService } from '../application/services/ad-lifecycle.service';
import { UpdateAdDto, AdLifecycleHistoryDto } from '../application/services/ad-lifecycle.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader, ApiBody } from '@nestjs/swagger';

@ApiTags('Ad Lifecycle Management')
@Controller({ path: 'ads', version: '1' })
@UseGuards(AuthGuard)
export class AdLifecycleController {
  constructor(private readonly lifecycleService: AdLifecycleService) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Update a published Ad attributes on Facebook' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiBody({ type: UpdateAdDto })
  async updateAd(
    @Param('id') adId: string,
    @Body() dto: UpdateAdDto,
    @Req() req: any,
  ): Promise<AdLifecycleHistoryDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.lifecycleService.updateAd(adId, workspaceId, userId, dto);
  }

  @Patch(':id/pause')
  @ApiOperation({ summary: 'Pause a published Ad on Facebook' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async pauseAd(
    @Param('id') adId: string,
    @Req() req: any,
  ): Promise<AdLifecycleHistoryDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.lifecycleService.pauseAd(adId, workspaceId, userId);
  }

  @Patch(':id/resume')
  @ApiOperation({ summary: 'Resume a paused Ad on Facebook' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async resumeAd(
    @Param('id') adId: string,
    @Req() req: any,
  ): Promise<AdLifecycleHistoryDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.lifecycleService.resumeAd(adId, workspaceId, userId);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive a published Ad on Facebook' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async archiveAd(
    @Param('id') adId: string,
    @Req() req: any,
  ): Promise<AdLifecycleHistoryDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.lifecycleService.archiveAd(adId, workspaceId, userId);
  }
}
