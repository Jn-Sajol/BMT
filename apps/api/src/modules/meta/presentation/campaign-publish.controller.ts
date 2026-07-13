import { Controller, Post, Param, Req, UseGuards } from '@nestjs/common';
import { CampaignPublishService } from '../application/services/campaign-publish.service';
import { CampaignResponseDto } from '../../../common/dto/campaign.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@ApiTags('Meta Campaigns Publish')
@Controller({ path: 'meta/campaigns', version: '1' })
@UseGuards(AuthGuard)
export class CampaignPublishController {
  constructor(private readonly publishService: CampaignPublishService) {}

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish campaign draft to Meta' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async publish(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<CampaignResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.publishService.publish(id, workspaceId, userId);
  }
}
