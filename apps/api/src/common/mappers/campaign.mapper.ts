import { Campaign, CampaignLabel, CampaignTag } from '@prisma/client';
import { CampaignResponseDto } from '../dto/campaign.dto';

export class CampaignMapper {
  static toResponse(
    entity: Campaign & { labels?: CampaignLabel[]; tags?: CampaignTag[] },
  ): CampaignResponseDto {
    return {
      id: entity.id,
      workspaceId: entity.workspaceId,
      organizationId: entity.organizationId,
      metaBusinessId: entity.metaBusinessId,
      metaAdAccountId: entity.metaAdAccountId,
      name: entity.name,
      objective: entity.objective,
      buyingType: entity.buyingType,
      specialAdCategory: entity.specialAdCategory,
      status: entity.status,
      draftVersion: entity.draftVersion,
      publishedVersion: entity.publishedVersion,
      isPublished: entity.isPublished,
      labels: entity.labels ? entity.labels.map((l) => l.name) : [],
      tags: entity.tags ? entity.tags.map((t) => t.name) : [],
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
