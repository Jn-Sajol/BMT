import { Controller, Post, Param, Req, UseGuards } from '@nestjs/common';
import { AdCreativePublishService } from '../application/services/adcreative-publish.service';
import { AdCreativeResponseDto } from '../../../application/adcreative/common/adcreative.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@ApiTags('Meta Ad Creatives Publish')
@Controller({ path: 'meta/adcreatives', version: '1' })
@UseGuards(AuthGuard)
export class AdCreativePublishController {
  constructor(private readonly publishService: AdCreativePublishService) {}

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish Ad Creative draft to Meta' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async publish(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<AdCreativeResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.publishService.publish(id, workspaceId, userId);
  }
}
