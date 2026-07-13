import { Controller, Post, Get, Put, Delete, Param, Body, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AutomationRuleService } from '../application/services/automation-rule.service';
import { AutomationExecutionEngine } from '../application/services/automation-execution-engine';
import { CreateAutomationRuleDto, UpdateAutomationRuleDto } from '../application/dto/automation-rule.dto';
import { AutomationMapper } from '../application/mapper/automation.mapper';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader, ApiBody } from '@nestjs/swagger';

@ApiTags('Automation Rule Engine')
@Controller({ path: 'automation/rules', version: '1' })
@UseGuards(AuthGuard)
export class AutomationController {
  constructor(
    private readonly ruleService: AutomationRuleService,
    private readonly executionEngine: AutomationExecutionEngine,
    private readonly mapper: AutomationMapper,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new automation rule draft' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiBody({ type: CreateAutomationRuleDto })
  async createRule(
    @Body() dto: CreateAutomationRuleDto,
    @Req() req: any,
  ): Promise<any> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    const rule = await this.ruleService.createRule(workspaceId, dto, userId);
    return this.mapper.toResponse(rule);
  }

  @Get()
  @ApiOperation({ summary: 'List all automation rules for workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async listRules(@Req() req: any): Promise<any[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const rules = await this.ruleService.listRules(workspaceId);
    return this.mapper.toResponseList(rules);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific automation rule' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getRule(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<any> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const rule = await this.ruleService.getRule(id, workspaceId);
    return this.mapper.toResponse(rule);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an automation rule (creates new draft version)' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiBody({ type: UpdateAutomationRuleDto })
  async updateRule(
    @Param('id') id: string,
    @Body() dto: UpdateAutomationRuleDto,
    @Req() req: any,
  ): Promise<any> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    const rule = await this.ruleService.updateRule(id, workspaceId, dto, userId);
    return this.mapper.toResponse(rule);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish the latest draft rule version' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async publishRule(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<any> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const rule = await this.ruleService.publishRule(id, workspaceId);
    return this.mapper.toResponse(rule);
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate a published automation rule' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async activateRule(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<any> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const rule = await this.ruleService.activateRule(id, workspaceId);
    return this.mapper.toResponse(rule);
  }

  @Post(':id/disable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Disable an active automation rule' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async disableRule(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<any> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const rule = await this.ruleService.disableRule(id, workspaceId);
    return this.mapper.toResponse(rule);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Archive an automation rule' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async archiveRule(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<any> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const rule = await this.ruleService.archiveRule(id, workspaceId);
    return this.mapper.toResponse(rule);
  }

  @Post(':id/execute')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manually execute an automation rule' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async executeRule(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: any,
  ): Promise<any> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    const dryRun = body.dryRun === true;
    return await this.executionEngine.executeRuleManually(id, workspaceId, body.payload || {}, userId, dryRun);
  }
}
