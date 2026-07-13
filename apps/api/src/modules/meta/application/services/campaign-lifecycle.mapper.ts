import { CampaignLifecycleHistory } from '@prisma/client';
import { CampaignLifecycleHistoryDto } from './campaign-lifecycle.dto';

export class CampaignLifecycleMapper {
  static toHistoryDto(entity: CampaignLifecycleHistory): CampaignLifecycleHistoryDto {
    return {
      id: entity.id,
      campaignId: entity.campaignId,
      action: entity.action,
      beforeStatus: entity.beforeStatus,
      afterStatus: entity.afterStatus,
      performedBy: entity.performedBy,
      performedAt: entity.performedAt.toISOString(),
      metaResponse: entity.metaResponse || undefined,
    };
  }
}
