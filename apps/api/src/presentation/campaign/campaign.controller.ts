import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { CampaignService } from '../../application/services/campaign.service';
import { CampaignHistoryService } from '../../application/services/campaign-history.service';
import { CreateCampaignDto, UpdateCampaignDto, CampaignResponseDto } from '../../common/dto/campaign.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@ApiTags('Campaigns')
@Controller({ path: 'campaigns', version: '1' })
@UseGuards(AuthGuard)
export class CampaignController {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly historyService: CampaignHistoryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create campaign draft' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiHeader({ name: 'x-organization-id', required: true })
  async create(@Body() dto: CreateCampaignDto, @Req() req: any): Promise<CampaignResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const organizationId = req.headers['x-organization-id'] as string;
    const userId = req.user.id;
    return await this.campaignService.create(dto, workspaceId, organizationId, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaign drafts for current workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async findAll(@Req() req: any): Promise<CampaignResponseDto[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.campaignService.findAll(workspaceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign details by ID' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async findOne(@Param('id') id: string, @Req() req: any): Promise<CampaignResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.campaignService.findOne(id, workspaceId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update campaign draft details' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCampaignDto,
    @Req() req: any,
  ): Promise<CampaignResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.campaignService.update(id, dto, workspaceId, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete campaign draft' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async remove(@Param('id') id: string, @Req() req: any): Promise<void> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    await this.campaignService.delete(id, workspaceId, userId);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate campaign draft' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async duplicate(@Param('id') id: string, @Req() req: any): Promise<CampaignResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.campaignService.duplicate(id, workspaceId, userId);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore campaign details to a specific snapshot version' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async restore(
    @Param('id') id: string,
    @Query('version') versionStr: string,
    @Req() req: any,
  ): Promise<CampaignResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    const version = parseInt(versionStr, 10);
    return await this.campaignService.restore(id, version, workspaceId, userId);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get version snapshot history for campaign' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getHistory(@Param('id') id: string): Promise<any[]> {
    return await this.historyService.getHistory(id);
  }
}
