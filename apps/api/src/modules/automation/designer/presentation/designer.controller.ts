import { Controller, Get, Post, Body, Param, UseGuards, Inject, Req, HttpCode, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { WorkflowManagementService } from '../application/services/workflow-management.service';
import { WorkflowValidationService } from '../application/services/workflow-validation.service';
import { PRISMA_CLIENT } from '../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../infrastructure/database/prisma-extensions';
import { AuthGuard } from '../../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@ApiTags('Visual Automation Workflow Designer')
@Controller('api/automation/workflows')
@UseGuards(AuthGuard)
export class DesignerController {
  constructor(
    private readonly managementService: WorkflowManagementService,
    private readonly validationService: WorkflowValidationService,
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List workflows inside current workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getWorkflows(@Req() req: any) {
    const workspaceId = req.headers['x-workspace-id'];
    return await this.prisma.automationWorkflow.findMany({
      where: { workspaceId },
      include: { versions: true },
    });
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get templates catalog' })
  async getTemplates() {
    return await this.prisma.automationWorkflowTemplate.findMany();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workflow details and versions list' })
  async getWorkflow(@Param('id') id: string) {
    const workflow = await this.prisma.automationWorkflow.findUnique({
      where: { id },
      include: { versions: true },
    });
    if (!workflow) {
      throw new NotFoundException(`Workflow ${id} not found.`);
    }
    return workflow;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save canvas nodes draft configuration' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async saveDraft(
    @Body('id') id: string,
    @Body('name') name: string,
    @Body('canvasJson') canvasJson: any,
    @Req() req: any,
  ) {
    const workspaceId = req.headers['x-workspace-id'];
    return await this.managementService.saveDraft(workspaceId, id, name, canvasJson);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Compile, validate, and publish canvas design' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async publishWorkflow(
    @Param('id') id: string,
    @Body('notes') notes: string,
    @Req() req: any,
  ) {
    const workspaceId = req.headers['x-workspace-id'];
    const authorId = req.user?.id || '00000000-0000-0000-0000-000000000000';
    return await this.managementService.publishWorkflow(workspaceId, id, authorId, notes);
  }

  @Post(':id/rollback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rollback to a previously published version configuration' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async rollbackWorkflow(
    @Param('id') id: string,
    @Body('version') version: number,
    @Req() req: any,
  ) {
    const workspaceId = req.headers['x-workspace-id'];
    return await this.managementService.rollbackWorkflow(workspaceId, id, version);
  }

  @Post(':id/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate canvas layout structure edges and loops' })
  async validateWorkflow(@Param('id') id: string) {
    const draft = await this.prisma.automationWorkflowVersion.findUnique({
      where: {
        workflowId_version: { workflowId: id, version: 1 },
      },
    });
    if (!draft) {
      throw new NotFoundException(`Draft version for workflow ${id} not found.`);
    }
    return await this.validationService.validate(draft.canvasJson);
  }

  @Post('import')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Import workflow template' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async importWorkflow(
    @Body('id') id: string,
    @Body('name') name: string,
    @Body('canvasJson') canvasJson: any,
    @Req() req: any,
  ) {
    const workspaceId = req.headers['x-workspace-id'];
    const workflow = await this.managementService.saveDraft(workspaceId, id, name, canvasJson);
    return { success: true, workflowId: workflow.id };
  }

  @Get(':id/export')
  @ApiOperation({ summary: 'Export workflow template details' })
  async exportWorkflow(@Param('id') id: string) {
    const draft = await this.prisma.automationWorkflowVersion.findUnique({
      where: {
        workflowId_version: { workflowId: id, version: 1 },
      },
    });
    if (!draft) {
      throw new NotFoundException(`Draft version for workflow ${id} not found.`);
    }
    return {
      workflowId: id,
      canvasJson: draft.canvasJson,
    };
  }
}
