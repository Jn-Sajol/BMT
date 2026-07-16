"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdSetLifecycleMapper = void 0;
class AdSetLifecycleMapper {
    static toHistoryDto(entity) {
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
exports.AdSetLifecycleMapper = AdSetLifecycleMapper;
//# sourceMappingURL=adset-lifecycle.mapper.js.map