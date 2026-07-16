import { CampaignLifecycleService } from '../../../meta/application/services/campaign-lifecycle.service';
import { AdSetLifecycleService } from '../../../meta/application/services/adset-lifecycle.service';
import { AdLifecycleService } from '../../../meta/application/services/ad-lifecycle.service';
export declare class AutomationDispatcher {
    private readonly campaignLifecycle;
    private readonly adSetLifecycle;
    private readonly adLifecycle;
    constructor(campaignLifecycle: CampaignLifecycleService, adSetLifecycle: AdSetLifecycleService, adLifecycle: AdLifecycleService);
    dispatch(action: any, workspaceId: string, userId: string, dryRun: boolean): Promise<any>;
}
