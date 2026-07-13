import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { AdCreativeService } from '../services/adcreative.service';
import { AdCreativeHistoryService } from '../services/adcreative-history.service';
import { CreateAdCreativeDto, UpdateAdCreativeDto, AdCreativeResponseDto } from '../common/adcreative.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@ApiTags('Ad Creatives')
@Controller({ version: '1' })
@UseGuards(AuthGuard)
export class AdCreativeController {
  constructor(
    private readonly creativeService: AdCreativeService,
    private readonly historyService: AdCreativeHistoryService,
  ) {}

  @Post('ad-creatives')
  @ApiOperation({ summary: 'Create Ad Creative draft' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async create(@Body() dto: CreateAdCreativeDto, @Req() req: any): Promise<AdCreativeResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.creativeService.create(dto, workspaceId, userId);
  }

  @Get('ad-creatives/:id')
  @ApiOperation({ summary: 'Get Ad Creative details' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async findOne(@Param('id') id: string, @Req() req: any): Promise<AdCreativeResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.creativeService.findOne(id, workspaceId);
  }

  @Put('ad-creatives/:id')
  @ApiOperation({ summary: 'Update Ad Creative draft' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAdCreativeDto,
    @Req() req: any,
  ): Promise<AdCreativeResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.creativeService.update(id, dto, workspaceId, userId);
  }

  @Delete('ad-creatives/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete Ad Creative draft' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async remove(@Param('id') id: string, @Req() req: any): Promise<void> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    await this.creativeService.delete(id, workspaceId, userId);
  }

  @Post('ad-creatives/:id/restore')
  @ApiOperation({ summary: 'Restore Ad Creative draft to specific version' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async restore(
    @Param('id') id: string,
    @Query('version') versionStr: string,
    @Req() req: any,
  ): Promise<AdCreativeResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    const version = parseInt(versionStr, 10);
    return await this.creativeService.restore(id, version, workspaceId, userId);
  }

  @Get('ad-creatives/:id/history')
  @ApiOperation({ summary: 'Get version snapshot history for Ad Creative' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getHistory(@Param('id') id: string): Promise<any[]> {
    return await this.historyService.getHistory(id);
  }

  @Get('campaigns/:campaignId/ad-creatives')
  @ApiOperation({ summary: 'Get all Ad Creatives belonging to campaign' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async findByCampaign(
    @Param('campaignId') campaignId: string,
    @Req() req: any,
  ): Promise<AdCreativeResponseDto[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.creativeService.findByCampaignId(campaignId, workspaceId);
  }
}
