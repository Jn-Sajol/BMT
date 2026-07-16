"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdCreativeLifecycleMapper = void 0;
class AdCreativeLifecycleMapper {
    static toHistoryDto(entity) {
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
exports.AdCreativeLifecycleMapper = AdCreativeLifecycleMapper;
//# sourceMappingURL=adcreative-lifecycle.mapper.js.map