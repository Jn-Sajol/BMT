import { AdCreativeLifecycleHistory } from '@prisma/client';
import { AdCreativeLifecycleHistoryDto } from './adcreative-lifecycle.dto';

export class AdCreativeLifecycleMapper {
  static toHistoryDto(entity: AdCreativeLifecycleHistory): AdCreativeLifecycleHistoryDto {
    return {
      id: entity.id,
      creativeId: entity.creativeId,
      action: entity.action,
      beforeStatus: entity.beforeStatus,
      afterStatus: entity.afterStatus,
      performedBy: entity.performedBy,
      performedAt: entity.performedAt.toISOString(),
      metaResponse: entity.metaResponse || undefined,
    };
  }
}
