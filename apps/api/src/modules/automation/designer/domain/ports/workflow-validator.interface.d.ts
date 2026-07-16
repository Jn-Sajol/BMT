export interface ValidationIssue {
    nodeId?: string;
    edgeId?: string;
    severity: 'ERROR' | 'WARNING';
    message: string;
}
export interface IWorkflowValidator {
    validate(canvasJson: any): Promise<{
        isValid: boolean;
        issues: ValidationIssue[];
    }>;
}
