import { IWorkflowCompiler } from '../../domain/ports/workflow-compiler.interface';
export declare class WorkflowCompilerService implements IWorkflowCompiler {
    compile(canvasJson: any): Promise<{
        definitionJson: any;
        checksum: string;
    }>;
}
