"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdLifecycleMapper = void 0;
class AdLifecycleMapper {
    static toHistoryDto(entity) {
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
exports.AdLifecycleMapper = AdLifecycleMapper;
//# sourceMappingURL=ad-lifecycle.mapper.js.map