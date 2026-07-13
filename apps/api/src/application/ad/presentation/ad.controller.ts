import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { AdService } from '../services/ad.service';
import { AdHistoryService } from '../services/ad-history.service';
import { CreateAdDto, UpdateAdDto, AdResponseDto } from '../common/ad.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { AdRepository } from '../../../infrastructure/database/repositories/ad.repository';
import { AdMapper } from '../common/ad.mapper';

@ApiTags('Ads')
@Controller({ version: '1' })
@UseGuards(AuthGuard)
export class AdController {
  constructor(
    private readonly adService: AdService,
    private readonly historyService: AdHistoryService,
    private readonly adRepo: AdRepository,
  ) {}

  @Post('ads')
  @ApiOperation({ summary: 'Create Ad draft' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async create(@Body() dto: CreateAdDto, @Req() req: any): Promise<AdResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.adService.create(dto, workspaceId, userId);
  }

  @Get('ads')
  @ApiOperation({ summary: 'Get all Ads in current Workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async findAll(@Req() req: any): Promise<AdResponseDto[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const ads = await this.adRepo.findByWorkspaceId(workspaceId);
    return ads.map(AdMapper.toResponse);
  }

  @Get('ads/:id')
  @ApiOperation({ summary: 'Get Ad details' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async findOne(@Param('id') id: string, @Req() req: any): Promise<AdResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.adService.findOne(id, workspaceId);
  }

  @Put('ads/:id')
  @ApiOperation({ summary: 'Update Ad draft' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAdDto,
    @Req() req: any,
  ): Promise<AdResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.adService.update(id, dto, workspaceId, userId);
  }

  @Delete('ads/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete Ad draft' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async remove(@Param('id') id: string, @Req() req: any): Promise<void> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    await this.adService.delete(id, workspaceId, userId);
  }

  @Post('ads/:id/duplicate')
  @ApiOperation({ summary: 'Duplicate Ad draft' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async duplicate(@Param('id') id: string, @Req() req: any): Promise<AdResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.adService.duplicate(id, workspaceId, userId);
  }

  @Post('ads/:id/restore/:version')
  @ApiOperation({ summary: 'Restore Ad draft to specific version snapshot' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async restore(
    @Param('id') id: string,
    @Param('version') versionStr: string,
    @Req() req: any,
  ): Promise<AdResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    const version = parseInt(versionStr, 10);
    return await this.adService.restore(id, version, workspaceId, userId);
  }

  @Get('ads/:id/history')
  @ApiOperation({ summary: 'Get version snapshot history for Ad' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getHistory(@Param('id') id: string): Promise<any[]> {
    return await this.historyService.getHistory(id);
  }
}
