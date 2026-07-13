import { Controller, Post, Param, Req, UseGuards } from '@nestjs/common';
import { AdSetPublishService } from '../application/services/adset-publish.service';
import { AdSetResponseDto } from '../../../application/adset/common/adset.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@ApiTags('Meta Ad Sets Publish')
@Controller({ path: 'meta/adsets', version: '1' })
@UseGuards(AuthGuard)
export class AdSetPublishController {
  constructor(private readonly publishService: AdSetPublishService) {}

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish Ad Set draft to Meta' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async publish(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<AdSetResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.publishService.publish(id, workspaceId, userId);
  }
}
