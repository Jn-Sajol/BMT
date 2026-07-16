"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdSetResponseDto = exports.UpdateAdSetDto = exports.CreateAdSetDto = void 0;
class CreateAdSetDto {
    campaignId;
    name;
    optimizationGoal;
    billingEvent;
    bidStrategy;
    dailyBudget;
    lifetimeBudget;
    startTime;
    endTime;
    attributionSetting;
    targeting;
    promotedObject;
    metaPixelId;
    instagramAccountId;
    facebookPageId;
    labels;
    tags;
}
exports.CreateAdSetDto = CreateAdSetDto;
class UpdateAdSetDto {
    name;
    status;
    optimizationGoal;
    billingEvent;
    bidStrategy;
    dailyBudget;
    lifetimeBudget;
    startTime;
    endTime;
    attributionSetting;
    targeting;
    promotedObject;
    metaPixelId;
    instagramAccountId;
    facebookPageId;
    labels;
    tags;
}
exports.UpdateAdSetDto = UpdateAdSetDto;
class AdSetResponseDto {
    id;
    campaignId;
    name;
    status;
    optimizationGoal;
    billingEvent;
    bidStrategy;
    dailyBudget;
    lifetimeBudget;
    startTime;
    endTime;
    attributionSetting;
    targeting;
    promotedObject;
    metaPixelId;
    instagramAccountId;
    facebookPageId;
    draftVersion;
    createdBy;
    updatedBy;
    createdAt;
    updatedAt;
    publishedAt;
    publishedBy;
    externalAdSetId;
    labels;
    tags;
}
exports.AdSetResponseDto = AdSetResponseDto;
//# sourceMappingURL=adset.dto.js.map