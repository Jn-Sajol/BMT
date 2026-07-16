"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdMapper = void 0;
class AdMapper {
    static toResponse(entity) {
        return {
            id: entity.id,
            workspaceId: entity.workspaceId,
            campaignId: entity.campaignId,
            adSetId: entity.adSetId,
            creativeId: entity.creativeId,
            name: entity.name,
            status: entity.status,
            draftVersion: entity.draftVersion,
            externalAdId: entity.externalAdId || undefined,
            publishedAt: entity.publishedAt ? entity.publishedAt.toISOString() : undefined,
            publishedBy: entity.publishedBy || undefined,
            trackingSpecs: entity.trackingSpecs,
            displayStatus: entity.displayStatus || undefined,
            reviewStatus: entity.reviewStatus || undefined,
            createdBy: entity.createdBy,
            updatedBy: entity.updatedBy,
            createdAt: entity.createdAt.toISOString(),
            updatedAt: entity.updatedAt.toISOString(),
            labels: entity.labels ? entity.labels.map((l) => l.name) : [],
            tags: entity.tags ? entity.tags.map((t) => t.name) : [],
        };
    }
}
exports.AdMapper = AdMapper;
//# sourceMappingURL=ad.mapper.js.map