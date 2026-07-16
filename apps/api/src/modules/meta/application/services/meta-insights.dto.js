"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncHistoryResponseDto = exports.AdInsightResponseDto = exports.AdSetInsightResponseDto = exports.CampaignInsightResponseDto = exports.SyncInsightsDto = void 0;
class SyncInsightsDto {
    datePreset;
    since;
    until;
}
exports.SyncInsightsDto = SyncInsightsDto;
class CampaignInsightResponseDto {
    id;
    workspaceId;
    campaignId;
    facebookObjectId;
    provider;
    date;
    impressions;
    reach;
    frequency;
    clicks;
    spend;
    purchase;
    purchaseValue;
    syncedAt;
}
exports.CampaignInsightResponseDto = CampaignInsightResponseDto;
class AdSetInsightResponseDto {
    id;
    workspaceId;
    adSetId;
    facebookObjectId;
    provider;
    date;
    impressions;
    reach;
    frequency;
    clicks;
    spend;
    purchase;
    purchaseValue;
    syncedAt;
}
exports.AdSetInsightResponseDto = AdSetInsightResponseDto;
class AdInsightResponseDto {
    id;
    workspaceId;
    adId;
    facebookObjectId;
    provider;
    date;
    impressions;
    reach;
    frequency;
    clicks;
    spend;
    purchase;
    purchaseValue;
    syncedAt;
}
exports.AdInsightResponseDto = AdInsightResponseDto;
class SyncHistoryResponseDto {
    id;
    workspaceId;
    status;
    startedAt;
    finishedAt;
    recordsProcessed;
    recordsCreated;
    recordsUpdated;
    duration;
    errorMessage;
}
exports.SyncHistoryResponseDto = SyncHistoryResponseDto;
//# sourceMappingURL=meta-insights.dto.js.map