"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdResponseDto = exports.UpdateAdDto = exports.CreateAdDto = void 0;
class CreateAdDto {
    campaignId;
    adSetId;
    creativeId;
    name;
    trackingSpecs;
    labels;
    tags;
}
exports.CreateAdDto = CreateAdDto;
class UpdateAdDto {
    name;
    trackingSpecs;
    status;
    labels;
    tags;
}
exports.UpdateAdDto = UpdateAdDto;
class AdResponseDto {
    id;
    workspaceId;
    campaignId;
    adSetId;
    creativeId;
    name;
    status;
    draftVersion;
    externalAdId;
    publishedAt;
    publishedBy;
    trackingSpecs;
    displayStatus;
    reviewStatus;
    createdBy;
    updatedBy;
    createdAt;
    updatedAt;
    labels;
    tags;
}
exports.AdResponseDto = AdResponseDto;
//# sourceMappingURL=ad.dto.js.map