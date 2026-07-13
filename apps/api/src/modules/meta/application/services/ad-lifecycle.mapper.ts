import { AdLifecycleHistory } from '@prisma/client';
import { AdLifecycleHistoryDto } from './ad-lifecycle.dto';

export class AdLifecycleMapper {
  static toHistoryDto(entity: AdLifecycleHistory): AdLifecycleHistoryDto {
    return {
      id: entity.id,
      adId: entity.adId,
      action: entity.action,
      beforeStatus: entity.beforeStatus,
      afterStatus: entity.afterStatus,
      performedBy: entity.performedBy,
      performedAt: entity.performedAt.toISOString(),
      metaResponse: entity.metaResponse || undefined,
    };
  }
}
