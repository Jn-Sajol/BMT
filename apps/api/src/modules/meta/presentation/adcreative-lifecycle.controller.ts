import { Controller, Patch, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AdCreativeLifecycleService } from '../application/services/adcreative-lifecycle.service';
import { UpdateAdCreativeDto, AdCreativeLifecycleHistoryDto } from '../application/services/adcreative-lifecycle.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader, ApiBody } from '@nestjs/swagger';

@ApiTags('AdCreative Lifecycle Management')
@Controller({ path: 'creatives', version: '1' })
@UseGuards(AuthGuard)
export class AdCreativeLifecycleController {
  constructor(private readonly lifecycleService: AdCreativeLifecycleService) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Update a published AdCreative attributes on Facebook' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiBody({ type: UpdateAdCreativeDto })
  async updateAdCreative(
    @Param('id') creativeId: string,
    @Body() dto: UpdateAdCreativeDto,
    @Req() req: any,
  ): Promise<AdCreativeLifecycleHistoryDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.lifecycleService.updateAdCreative(creativeId, workspaceId, userId, dto);
  }
}
