import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Inject, Req, HttpCode, HttpStatus, Query, NotFoundException } from '@nestjs/common';
import { MarketplaceService } from '../application/services/marketplace.service';
import { TemplateSearchService } from '../application/services/template-search.service';
import { TemplatePublisherService } from '../application/services/template-publisher.service';
import { TemplateInstallerService } from '../application/services/template-installer.service';
import { TemplateReviewService } from '../application/services/template-review.service';
import { PRISMA_CLIENT } from '../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../infrastructure/database/prisma-extensions';
import { AuthGuard } from '../../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@ApiTags('Automation Marketplace & Template Hub')
@Controller('api/automation/marketplace')
@UseGuards(AuthGuard)
export class MarketplaceController {
  constructor(
    private readonly marketplaceService: MarketplaceService,
    private readonly searchService: TemplateSearchService,
    private readonly publisherService: TemplatePublisherService,
    private readonly installerService: TemplateInstallerService,
    private readonly reviewService: TemplateReviewService,
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Browse all templates' })
  async getTemplates() {
    return await this.prisma.automationTemplate.findMany({
      include: { versions: true },
    });
  }

  @Get('categories')
  @ApiOperation({ summary: 'List categories' })
  async getCategories() {
    return await this.marketplaceService.getCategories();
  }

  @Get('tags')
  @ApiOperation({ summary: 'List tags' })
  async getTags() {
    return await this.marketplaceService.getTags();
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured official templates list' })
  async getFeatured() {
    return await this.marketplaceService.getFeatured();
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular templates list' })
  async getPopular() {
    return await this.marketplaceService.getPopular();
  }

  @Get('recommended')
  @ApiOperation({ summary: 'Get AI recommended templates list' })
  async getRecommended() {
    return await this.marketplaceService.getRecommended();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search and filter marketplace templates' })
  async searchTemplates(
    @Query('q') query: string,
    @Query('category') category: string,
    @Query('visibility') visibility: string,
  ) {
    return await this.searchService.search(query, { category, visibility });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template details and changelog version history' })
  async getTemplate(@Param('id') id: string) {
    const template = await this.prisma.automationTemplate.findUnique({
      where: { id },
      include: { versions: true, reviews: true },
    });
    if (!template) {
      throw new NotFoundException(`Template ${id} not found.`);
    }
    return template;
  }

  @Post('publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish template version details' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async publishTemplate(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('canvasJson') canvasJson: any,
    @Body('visibility') visibility: any,
    @Body('version') version: string,
    @Body('changelog') changelog: string,
    @Req() req: any,
  ) {
    const workspaceId = req.headers['x-workspace-id'];
    const authorId = req.user?.id || '00000000-0000-0000-0000-000000000000';
    return await this.publisherService.publish(
      workspaceId,
      authorId,
      name,
      description,
      canvasJson,
      visibility,
      version,
      changelog,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update master template descriptions' })
  async updateTemplate(
    @Param('id') id: string,
    @Body('description') description: string,
  ) {
    return await this.prisma.automationTemplate.update({
      where: { id },
      data: { description },
    });
  }

  @Post(':id/install')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Install template workflow package' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async installTemplate(
    @Param('id') id: string,
    @Body('version') version: string,
    @Req() req: any,
  ) {
    const workspaceId = req.headers['x-workspace-id'];
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000000';
    return await this.installerService.install(workspaceId, id, version, userId);
  }

  @Post(':id/rollback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rollback installed workflow version' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async rollbackInstallation(
    @Param('id') installationId: string,
    @Body('version') version: string,
    @Req() req: any,
  ) {
    const workspaceId = req.headers['x-workspace-id'];
    return await this.installerService.rollback(workspaceId, installationId, version);
  }

  @Post(':id/review')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Post templates feedback review' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async createReview(
    @Param('id') id: string,
    @Body('rating') rating: number,
    @Body('comment') comment: string,
    @Req() req: any,
  ) {
    const workspaceId = req.headers['x-workspace-id'];
    return await this.reviewService.createReview(workspaceId, id, rating, comment);
  }

  @Delete(':id/review')
  @ApiOperation({ summary: 'Delete template feedback review' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async deleteReview(@Param('id') reviewId: string, @Req() req: any) {
    const workspaceId = req.headers['x-workspace-id'];
    await this.reviewService.deleteReview(workspaceId, reviewId);
    return { success: true };
  }

  @Get(':id/analytics')
  @ApiOperation({ summary: 'Fetch template execution analytics data' })
  async getAnalytics(@Param('id') templateId: string) {
    const record = await this.prisma.automationTemplateAnalytics.findFirst({
      where: { templateId },
    });
    if (!record) {
      return {
        installs: 0,
        clones: 0,
        executions: 0,
        successRate: 1.0,
        averageRoi: 0.0,
      };
    }
    return record;
  }
}
