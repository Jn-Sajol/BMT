import { OnModuleInit } from '@nestjs/common';
import { IActionRegistry } from './domain/ports/action-registry.interface';
import * as CoreActions from './infrastructure/executors/core-actions';
export declare class ActionModule implements OnModuleInit {
    private readonly registry;
    private readonly pauseCampaign;
    private readonly resumeCampaign;
    private readonly pauseAdSet;
    private readonly resumeAdSet;
    private readonly pauseAd;
    private readonly resumeAd;
    private readonly callWebhook;
    private readonly sendNotification;
    constructor(registry: IActionRegistry, pauseCampaign: CoreActions.PauseCampaignExecutor, resumeCampaign: CoreActions.ResumeCampaignExecutor, pauseAdSet: CoreActions.PauseAdSetExecutor, resumeAdSet: CoreActions.ResumeAdSetExecutor, pauseAd: CoreActions.PauseAdExecutor, resumeAd: CoreActions.ResumeAdExecutor, callWebhook: CoreActions.CallWebhookExecutor, sendNotification: CoreActions.SendNotificationExecutor);
    onModuleInit(): void;
}
