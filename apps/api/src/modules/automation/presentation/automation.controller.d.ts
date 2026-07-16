import { AutomationRuleService } from '../application/services/automation-rule.service';
import { AutomationExecutionEngine } from '../application/services/automation-execution-engine';
import { CreateAutomationRuleDto, UpdateAutomationRuleDto } from '../application/dto/automation-rule.dto';
import { AutomationMapper } from '../application/mapper/automation.mapper';
export declare class AutomationController {
    private readonly ruleService;
    private readonly executionEngine;
    private readonly mapper;
    constructor(ruleService: AutomationRuleService, executionEngine: AutomationExecutionEngine, mapper: AutomationMapper);
    createRule(dto: CreateAutomationRuleDto, req: any): Promise<any>;
    listRules(req: any): Promise<any[]>;
    getRule(id: string, req: any): Promise<any>;
    updateRule(id: string, dto: UpdateAutomationRuleDto, req: any): Promise<any>;
    publishRule(id: string, req: any): Promise<any>;
    activateRule(id: string, req: any): Promise<any>;
    disableRule(id: string, req: any): Promise<any>;
    archiveRule(id: string, req: any): Promise<any>;
    executeRule(id: string, body: any, req: any): Promise<any>;
}
