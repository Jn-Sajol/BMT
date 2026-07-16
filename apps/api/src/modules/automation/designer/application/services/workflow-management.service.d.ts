import { WorkflowCompilerService } from './workflow-compiler.service';
import { WorkflowValidationService } from './workflow-validation.service';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
export declare class WorkflowManagementService {
    private readonly compiler;
    private readonly validator;
    private readonly eventBus;
    private readonly prisma;
    constructor(compiler: WorkflowCompilerService, validator: WorkflowValidationService, eventBus: IEventBus, prisma: ExtendedPrismaClient);
    saveDraft(workspaceId: string, id: string, name: string, canvasJson: any): Promise<any>;
    publishWorkflow(workspaceId: string, id: string, authorId: string, notes?: string): Promise<any>;
    rollbackWorkflow(workspaceId: string, id: string, targetVersion: number): Promise<any>;
    private publishEvent;
}
