"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignLifecycleMapper = void 0;
class CampaignLifecycleMapper {
    static toHistoryDto(entity) {
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
exports.CampaignLifecycleMapper = CampaignLifecycleMapper;
//# sourceMappingURL=campaign-lifecycle.mapper.js.map