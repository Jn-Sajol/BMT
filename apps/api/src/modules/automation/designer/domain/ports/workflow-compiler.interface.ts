export interface IWorkflowCompiler {
  compile(canvasJson: any): Promise<{
    definitionJson: any;
    checksum: string;
  }>;
}
