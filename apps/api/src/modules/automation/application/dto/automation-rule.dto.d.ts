export declare class CreateAutomationRuleDto {
    name: string;
    description?: string;
    trigger: any;
    conditions?: any;
    actions: any[];
    schemaVersion?: number;
}
export declare class UpdateAutomationRuleDto {
    name?: string;
    description?: string;
    trigger?: any;
    conditions?: any;
    actions?: any[];
}
