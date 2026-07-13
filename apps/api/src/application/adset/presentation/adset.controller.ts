import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { AdSetService } from '../services/adset.service';
import { AdSetHistoryService } from '../services/adset-history.service';
import { CreateAdSetDto, UpdateAdSetDto, AdSetResponseDto } from '../common/adset.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@ApiTags('Ad Sets')
@Controller({ version: '1' })
@UseGuards(AuthGuard)
export class AdSetController {
  constructor(
    private readonly adSetService: AdSetService,
    private readonly historyService: AdSetHistoryService,
  ) {}

  @Post('adsets')
  @ApiOperation({ summary: 'Create Ad Set draft' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async create(@Body() dto: CreateAdSetDto, @Req() req: any): Promise<AdSetResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.adSetService.create(dto, workspaceId, userId);
  }

  @Get('adsets/:id')
  @ApiOperation({ summary: 'Get Ad Set details' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async findOne(@Param('id') id: string, @Req() req: any): Promise<AdSetResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.adSetService.findOne(id, workspaceId);
  }

  @Put('adsets/:id')
  @ApiOperation({ summary: 'Update Ad Set draft' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAdSetDto,
    @Req() req: any,
  ): Promise<AdSetResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.adSetService.update(id, dto, workspaceId, userId);
  }

  @Delete('adsets/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete Ad Set draft' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async remove(@Param('id') id: string, @Req() req: any): Promise<void> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    await this.adSetService.delete(id, workspaceId, userId);
  }

  @Post('adsets/:id/restore')
  @ApiOperation({ summary: 'Restore Ad Set draft to specific version' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async restore(
    @Param('id') id: string,
    @Query('version') versionStr: string,
    @Req() req: any,
  ): Promise<AdSetResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    const version = parseInt(versionStr, 10);
    return await this.adSetService.restore(id, version, workspaceId, userId);
  }

  @Get('adsets/:id/history')
  @ApiOperation({ summary: 'Get version snapshot history for Ad Set' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getHistory(@Param('id') id: string): Promise<any[]> {
    return await this.historyService.getHistory(id);
  }

  @Get('campaigns/:campaignId/adsets')
  @ApiOperation({ summary: 'Get all Ad Sets belonging to campaign' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async findByCampaign(
    @Param('campaignId') campaignId: string,
    @Req() req: any,
  ): Promise<AdSetResponseDto[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.adSetService.findByCampaignId(campaignId, workspaceId);
  }
}
