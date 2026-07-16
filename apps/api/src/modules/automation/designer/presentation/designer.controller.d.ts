import { WorkflowManagementService } from '../application/services/workflow-management.service';
import { WorkflowValidationService } from '../application/services/workflow-validation.service';
import { ExtendedPrismaClient } from '../../../../infrastructure/database/prisma-extensions';
export declare class DesignerController {
    private readonly managementService;
    private readonly validationService;
    private readonly prisma;
    constructor(managementService: WorkflowManagementService, validationService: WorkflowValidationService, prisma: ExtendedPrismaClient);
    getWorkflows(req: any): Promise<({
        versions: {
            id: string;
            createdAt: Date;
            version: number;
            authorId: string;
            checksum: string;
            workflowId: string;
            canvasJson: import("@prisma/client/runtime/library").JsonValue;
            definitionJson: import("@prisma/client/runtime/library").JsonValue;
            publishNotes: string | null;
        }[];
    } & {
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        workspaceId: string;
        activeVersion: number;
    })[]>;
    getTemplates(): Promise<{
        description: string;
        name: string;
        id: string;
        createdAt: Date;
        provider: string;
        canvasJson: import("@prisma/client/runtime/library").JsonValue;
        category: string;
    }[]>;
    getWorkflow(id: string): Promise<{
        versions: {
            id: string;
            createdAt: Date;
            version: number;
            authorId: string;
            checksum: string;
            workflowId: string;
            canvasJson: import("@prisma/client/runtime/library").JsonValue;
            definitionJson: import("@prisma/client/runtime/library").JsonValue;
            publishNotes: string | null;
        }[];
    } & {
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        workspaceId: string;
        activeVersion: number;
    }>;
    saveDraft(id: string, name: string, canvasJson: any, req: any): Promise<any>;
    publishWorkflow(id: string, notes: string, req: any): Promise<any>;
    rollbackWorkflow(id: string, version: number, req: any): Promise<any>;
    validateWorkflow(id: string): Promise<{
        isValid: boolean;
        issues: import("../domain/ports/workflow-validator.interface").ValidationIssue[];
    }>;
    importWorkflow(id: string, name: string, canvasJson: any, req: any): Promise<{
        success: boolean;
        workflowId: any;
    }>;
    exportWorkflow(id: string): Promise<{
        workflowId: string;
        canvasJson: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
