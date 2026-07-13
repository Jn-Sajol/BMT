import { Module } from '@nestjs/common';
import { WorkflowCompilerService } from './application/services/workflow-compiler.service';
import { WorkflowValidationService } from './application/services/workflow-validation.service';
import { WorkflowManagementService } from './application/services/workflow-management.service';
import { WorkflowNodeRegistry } from './infrastructure/registries/node-registry';
import { DesignerController } from './presentation/designer.controller';
import { ActionModule } from '../action/action.module';
import { DatabaseModule } from '../../../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule, ActionModule],
  controllers: [DesignerController],
  providers: [
    WorkflowCompilerService,
    WorkflowValidationService,
    WorkflowManagementService,
    WorkflowNodeRegistry,
    {
      provide: 'IWorkflowCompiler',
      useClass: WorkflowCompilerService,
    },
    {
      provide: 'IWorkflowValidator',
      useClass: WorkflowValidationService,
    },
  ],
  exports: [
    WorkflowCompilerService,
    WorkflowValidationService,
    WorkflowManagementService,
    WorkflowNodeRegistry,
    'IWorkflowCompiler',
    'IWorkflowValidator',
  ],
})
export class DesignerModule {}
