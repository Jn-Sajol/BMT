import { Controller, Get, Post, Param, UseGuards, Inject, Req, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { RecommendationHistoryService } from '../application/services/recommendation-history.service';
import { PRISMA_CLIENT } from '../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../infrastructure/database/prisma-extensions';
import { AuthGuard } from '../../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@ApiTags('Automation AI Recommendation & Optimization Engine')
@Controller('api/automation/recommendations')
@UseGuards(AuthGuard)
export class RecommendationController {
  constructor(
    private readonly historyService: RecommendationHistoryService,
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List current recommendations' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getRecommendations(@Req() req: any) {
    const workspaceId = req.headers['x-workspace-id'];
    return await this.prisma.automationRecommendation.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('history')
  @ApiOperation({ summary: 'List historical action selections' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getHistory(@Req() req: any) {
    const workspaceId = req.headers['x-workspace-id'];
    return await this.prisma.automationRecommendationHistory.findMany({
      where: {
        recommendation: { workspaceId },
      },
      include: { recommendation: true },
      orderBy: { actionAt: 'desc' },
    });
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get workspace health dashboard projection telemetry data' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getDashboard(@Req() req: any) {
    const workspaceId = req.headers['x-workspace-id'];
    
    const dashboard = await this.prisma.automationRecommendationDashboardProjection.findUnique({
      where: { workspaceId },
    });
    if (!dashboard) {
      return {
        workspaceId,
        optimizationScore: 100.0,
        automationHealth: 100.0,
        potentialSavings: 0.0,
        potentialRevenue: 0.0,
        acceptedCount: 0,
        rejectedCount: 0,
        pendingCount: 0,
      };
    }
    return dashboard;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get recommendation detail' })
  async getRecommendation(@Param('id') id: string) {
    const rec = await this.prisma.automationRecommendation.findUnique({
      where: { id },
    });
    if (!rec) {
      throw new NotFoundException(`Recommendation ${id} not found.`);
    }
    return rec;
  }

  @Post(':id/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept recommendation proposal' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async acceptRecommendation(@Param('id') id: string, @Req() req: any) {
    const workspaceId = req.headers['x-workspace-id'];
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000000';
    await this.historyService.accept(workspaceId, id, userId);
    return { success: true };
  }

  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject recommendation proposal' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async rejectRecommendation(@Param('id') id: string, @Req() req: any) {
    const workspaceId = req.headers['x-workspace-id'];
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000000';
    await this.historyService.reject(workspaceId, id, userId);
    return { success: true };
  }

  @Post(':id/ignore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ignore recommendation proposal' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async ignoreRecommendation(@Param('id') id: string, @Req() req: any) {
    const workspaceId = req.headers['x-workspace-id'];
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000000';
    await this.historyService.ignore(workspaceId, id, userId);
    return { success: true };
  }
}
