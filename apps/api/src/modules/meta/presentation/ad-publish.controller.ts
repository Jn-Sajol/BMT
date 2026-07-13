import { Controller, Post, Param, Req, UseGuards } from '@nestjs/common';
import { AdPublishService } from '../application/services/ad-publish.service';
import { AdResponseDto } from '../../../application/ad/common/ad.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@ApiTags('Meta Ads Publish')
@Controller({ path: 'meta/ads', version: '1' })
@UseGuards(AuthGuard)
export class AdPublishController {
  constructor(private readonly publishService: AdPublishService) {}

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish Ad draft to Meta' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async publish(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<AdResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.publishService.publish(id, workspaceId, userId);
  }
}
