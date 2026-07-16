"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaInsightsMapper = void 0;
class MetaInsightsMapper {
    static toCampaignResponse(entity) {
        return {
            id: entity.id,
            workspaceId: entity.workspaceId,
            campaignId: entity.campaignId,
            facebookObjectId: entity.facebookObjectId,
            provider: entity.provider,
            date: entity.date.toISOString().split('T')[0],
            impressions: entity.impressions,
            reach: entity.reach,
            frequency: entity.frequency,
            clicks: entity.clicks,
            spend: entity.spend,
            purchase: entity.purchase,
            purchaseValue: entity.purchaseValue,
            syncedAt: entity.syncedAt.toISOString(),
        };
    }
    static toAdSetResponse(entity) {
        return {
            id: entity.id,
            workspaceId: entity.workspaceId,
            adSetId: entity.adSetId,
            facebookObjectId: entity.facebookObjectId,
            provider: entity.provider,
            date: entity.date.toISOString().split('T')[0],
            impressions: entity.impressions,
            reach: entity.reach,
            frequency: entity.frequency,
            clicks: entity.clicks,
            spend: entity.spend,
            purchase: entity.purchase,
            purchaseValue: entity.purchaseValue,
            syncedAt: entity.syncedAt.toISOString(),
        };
    }
    static toAdResponse(entity) {
        return {
            id: entity.id,
            workspaceId: entity.workspaceId,
            adId: entity.adId,
            facebookObjectId: entity.facebookObjectId,
            provider: entity.provider,
            date: entity.date.toISOString().split('T')[0],
            impressions: entity.impressions,
            reach: entity.reach,
            frequency: entity.frequency,
            clicks: entity.clicks,
            spend: entity.spend,
            purchase: entity.purchase,
            purchaseValue: entity.purchaseValue,
            syncedAt: entity.syncedAt.toISOString(),
        };
    }
    static toSyncHistoryResponse(entity) {
        return {
            id: entity.id,
            workspaceId: entity.workspaceId,
            status: entity.status,
            startedAt: entity.startedAt.toISOString(),
            finishedAt: entity.finishedAt ? entity.finishedAt.toISOString() : undefined,
            recordsProcessed: entity.recordsProcessed,
            recordsCreated: entity.recordsCreated,
            recordsUpdated: entity.recordsUpdated,
            duration: entity.duration || undefined,
            errorMessage: entity.errorMessage || undefined,
        };
    }
}
exports.MetaInsightsMapper = MetaInsightsMapper;
//# sourceMappingURL=meta-insights.mapper.js.map