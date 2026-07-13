import { Controller, Patch, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AdSetLifecycleService } from '../application/services/adset-lifecycle.service';
import { UpdateAdSetDto, AdSetLifecycleHistoryDto } from '../application/services/adset-lifecycle.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader, ApiBody } from '@nestjs/swagger';

@ApiTags('AdSet Lifecycle Management')
@Controller({ path: 'adsets', version: '1' })
@UseGuards(AuthGuard)
export class AdSetLifecycleController {
  constructor(private readonly lifecycleService: AdSetLifecycleService) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Update a published AdSet attributes on Facebook' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiBody({ type: UpdateAdSetDto })
  async updateAdSet(
    @Param('id') adSetId: string,
    @Body() dto: UpdateAdSetDto,
    @Req() req: any,
  ): Promise<AdSetLifecycleHistoryDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.lifecycleService.updateAdSet(adSetId, workspaceId, userId, dto);
  }

  @Patch(':id/pause')
  @ApiOperation({ summary: 'Pause a published AdSet on Facebook' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async pauseAdSet(
    @Param('id') adSetId: string,
    @Req() req: any,
  ): Promise<AdSetLifecycleHistoryDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.lifecycleService.pauseAdSet(adSetId, workspaceId, userId);
  }

  @Patch(':id/resume')
  @ApiOperation({ summary: 'Resume a paused AdSet on Facebook' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async resumeAdSet(
    @Param('id') adSetId: string,
    @Req() req: any,
  ): Promise<AdSetLifecycleHistoryDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.lifecycleService.resumeAdSet(adSetId, workspaceId, userId);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive a published AdSet on Facebook' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async archiveAdSet(
    @Param('id') adSetId: string,
    @Req() req: any,
  ): Promise<AdSetLifecycleHistoryDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.lifecycleService.archiveAdSet(adSetId, workspaceId, userId);
  }
}
