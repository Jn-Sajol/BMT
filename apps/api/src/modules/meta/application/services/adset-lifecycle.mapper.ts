import { AdSetLifecycleHistory } from '@prisma/client';
import { AdSetLifecycleHistoryDto } from './adset-lifecycle.dto';

export class AdSetLifecycleMapper {
  static toHistoryDto(entity: AdSetLifecycleHistory): AdSetLifecycleHistoryDto {
    return {
      id: entity.id,
      adSetId: entity.adSetId,
      action: entity.action,
      beforeStatus: entity.beforeStatus,
      afterStatus: entity.afterStatus,
      performedBy: entity.performedBy,
      performedAt: entity.performedAt.toISOString(),
      metaResponse: entity.metaResponse || undefined,
    };
  }
}
