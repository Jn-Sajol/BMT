import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MetaStatusSyncService } from '../application/services/meta-status-sync.service';
import { StatusSyncHistoryDto } from '../application/services/meta-status.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@ApiTags('Meta Status & Delivery')
@Controller({ path: 'meta/status', version: '1' })
@UseGuards(AuthGuard)
export class MetaStatusController {
  constructor(private readonly syncService: MetaStatusSyncService) {}

  @Post('sync')
  @ApiOperation({ summary: 'Synchronize Meta Campaign, AdSet and Ad delivery statuses' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async sync(@Req() req: any): Promise<StatusSyncHistoryDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.syncService.sync(workspaceId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Retrieve Delivery status sync history logs' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getHistory(@Req() req: any): Promise<StatusSyncHistoryDto[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.syncService.getHistory(workspaceId);
  }
}
