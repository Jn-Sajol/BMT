import { IWorkflowValidator, ValidationIssue } from '../../domain/ports/workflow-validator.interface';
import { WorkflowNodeRegistry } from '../../infrastructure/registries/node-registry';
export declare class WorkflowValidationService implements IWorkflowValidator {
    private readonly nodeRegistry;
    constructor(nodeRegistry: WorkflowNodeRegistry);
    validate(canvasJson: any): Promise<{
        isValid: boolean;
        issues: ValidationIssue[];
    }>;
}
