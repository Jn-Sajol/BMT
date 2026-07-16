import { IActionExecutor, ActionExecutionContext, ActionExecutionResult } from '../../domain/ports/action-executor.interface';
import { CampaignLifecycleService } from '../../../../meta/application/services/campaign-lifecycle.service';
import { AdSetLifecycleService } from '../../../../meta/application/services/adset-lifecycle.service';
import { AdLifecycleService } from '../../../../meta/application/services/ad-lifecycle.service';
export declare class PauseCampaignExecutor implements IActionExecutor {
    private readonly lifecycle;
    actionType: string;
    constructor(lifecycle: CampaignLifecycleService);
    execute(params: any, context: ActionExecutionContext): Promise<ActionExecutionResult>;
}
export declare class ResumeCampaignExecutor implements IActionExecutor {
    private readonly lifecycle;
    actionType: string;
    constructor(lifecycle: CampaignLifecycleService);
    execute(params: any, context: ActionExecutionContext): Promise<ActionExecutionResult>;
}
export declare class PauseAdSetExecutor implements IActionExecutor {
    private readonly lifecycle;
    actionType: string;
    constructor(lifecycle: AdSetLifecycleService);
    execute(params: any, context: ActionExecutionContext): Promise<ActionExecutionResult>;
}
export declare class ResumeAdSetExecutor implements IActionExecutor {
    private readonly lifecycle;
    actionType: string;
    constructor(lifecycle: AdSetLifecycleService);
    execute(params: any, context: ActionExecutionContext): Promise<ActionExecutionResult>;
}
export declare class PauseAdExecutor implements IActionExecutor {
    private readonly lifecycle;
    actionType: string;
    constructor(lifecycle: AdLifecycleService);
    execute(params: any, context: ActionExecutionContext): Promise<ActionExecutionResult>;
}
export declare class ResumeAdExecutor implements IActionExecutor {
    private readonly lifecycle;
    actionType: string;
    constructor(lifecycle: AdLifecycleService);
    execute(params: any, context: ActionExecutionContext): Promise<ActionExecutionResult>;
}
export declare class CallWebhookExecutor implements IActionExecutor {
    actionType: string;
    execute(params: any, context: ActionExecutionContext): Promise<ActionExecutionResult>;
}
export declare class SendNotificationExecutor implements IActionExecutor {
    actionType: string;
    execute(params: any, context: ActionExecutionContext): Promise<ActionExecutionResult>;
}
