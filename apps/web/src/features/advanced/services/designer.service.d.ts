export declare const AdvancedDesignerService: {
    listWorkflows: () => Promise<any>;
    getWorkflow: (id: string) => Promise<any>;
    compileWorkflow: (id: string, payload: any) => Promise<any>;
    validateWorkflow: (id: string, payload: any) => Promise<any>;
    publishWorkflow: (id: string, payload: any) => Promise<any>;
    deployWorkflow: (id: string, payload: any) => Promise<any>;
    listExecutions: () => Promise<any>;
    getExecutionLogs: (id: string) => Promise<any>;
    listVariables: () => Promise<any>;
    listTriggers: () => Promise<any>;
};
