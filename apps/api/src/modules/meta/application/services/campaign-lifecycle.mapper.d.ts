import { CampaignLifecycleHistory } from '@prisma/client';
import { CampaignLifecycleHistoryDto } from './campaign-lifecycle.dto';
export declare class CampaignLifecycleMapper {
    static toHistoryDto(entity: CampaignLifecycleHistory): CampaignLifecycleHistoryDto;
}
