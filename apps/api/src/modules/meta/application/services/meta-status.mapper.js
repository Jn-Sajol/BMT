"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaStatusMapper = void 0;
class MetaStatusMapper {
    static toHistoryDto(entity) {
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
exports.MetaStatusMapper = MetaStatusMapper;
//# sourceMappingURL=meta-status.mapper.js.map