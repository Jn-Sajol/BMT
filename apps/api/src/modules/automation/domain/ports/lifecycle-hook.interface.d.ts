export interface IAutomationLifecycleHook {
    beforeEvaluate(context: any): Promise<void> | void;
    beforeDispatch(context: any, action: any): Promise<void> | void;
    afterDispatch(context: any, action: any, result: any): Promise<void> | void;
    afterComplete(context: any, auditLog: any): Promise<void> | void;
    afterFailure(context: any, error: Error): Promise<void> | void;
}
