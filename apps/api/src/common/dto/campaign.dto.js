"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignResponseDto = exports.UpdateCampaignDto = exports.CreateCampaignDto = void 0;
class CreateCampaignDto {
    name;
    objective;
    metaBusinessId;
    metaAdAccountId;
    buyingType;
    specialAdCategory;
    labels;
    tags;
}
exports.CreateCampaignDto = CreateCampaignDto;
class UpdateCampaignDto {
    name;
    objective;
    buyingType;
    specialAdCategory;
    status;
    labels;
    tags;
}
exports.UpdateCampaignDto = UpdateCampaignDto;
class CampaignResponseDto {
    id;
    workspaceId;
    organizationId;
    metaBusinessId;
    metaAdAccountId;
    name;
    objective;
    buyingType;
    specialAdCategory;
    status;
    draftVersion;
    publishedVersion;
    isPublished;
    labels;
    tags;
    createdBy;
    updatedBy;
    createdAt;
    updatedAt;
}
exports.CampaignResponseDto = CampaignResponseDto;
//# sourceMappingURL=campaign.dto.js.map