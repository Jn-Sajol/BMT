import { StatusSyncHistory } from '@prisma/client';
import { StatusSyncHistoryDto } from './meta-status.dto';

export class MetaStatusMapper {
  static toHistoryDto(entity: StatusSyncHistory): StatusSyncHistoryDto {
    return {
      id: entity.id,
      workspaceId: entity.workspaceId,
      status: entity.status,
      startedAt: entity.startedAt.toISOString(),
      finishedAt: entity.finishedAt ? entity.finishedAt.toISOString() : undefined,
      recordsProcessed: entity.recordsProcessed,
      recordsUpdated: entity.recordsUpdated,
      duration: entity.duration || undefined,
      errorMessage: entity.errorMessage || undefined,
    };
  }
}
