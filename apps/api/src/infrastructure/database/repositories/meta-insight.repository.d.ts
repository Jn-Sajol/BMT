import { CampaignInsightRepository } from './campaign-insight.repository';
import { AdSetInsightRepository } from './adset-insight.repository';
import { AdInsightRepository } from './ad-insight.repository';
export declare class MetaInsightRepository {
    readonly campaigns: CampaignInsightRepository;
    readonly adsets: AdSetInsightRepository;
    readonly ads: AdInsightRepository;
    constructor(campaigns: CampaignInsightRepository, adsets: AdSetInsightRepository, ads: AdInsightRepository);
}
