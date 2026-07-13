import { AdCreative, AdCreativeLabel, AdCreativeTag } from '@prisma/client';
import { AdCreativeResponseDto } from './adcreative.dto';

export class AdCreativeMapper {
  static toResponse(
    entity: AdCreative & { labels?: AdCreativeLabel[]; tags?: AdCreativeTag[] },
  ): AdCreativeResponseDto {
    return {
      id: entity.id,
      campaignId: entity.campaignId,
      creativeType: entity.creativeType,
      name: entity.name,
      primaryText: entity.primaryText,
      headline: entity.headline,
      description: entity.description || undefined,
      callToAction: entity.callToAction,
      destinationUrl: entity.destinationUrl,
      displayLink: entity.displayLink || undefined,
      caption: entity.caption || undefined,
      linkDescription: entity.linkDescription || undefined,
      facebookPageId: entity.facebookPageId || undefined,
      instagramAccountId: entity.instagramAccountId || undefined,
      mediaType: entity.mediaType || undefined,
      mediaAssetId: entity.mediaAssetId || undefined,
      thumbnailAssetId: entity.thumbnailAssetId || undefined,
      pixelId: entity.pixelId || undefined,
      trackingParameters: entity.trackingParameters,
      creativeSpec: entity.creativeSpec,
      status: entity.status,
      draftVersion: entity.draftVersion,
      externalCreativeId: entity.externalCreativeId || undefined,
      publishedAt: entity.publishedAt ? entity.publishedAt.toISOString() : undefined,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      labels: entity.labels ? entity.labels.map((l) => l.name) : [],
      tags: entity.tags ? entity.tags.map((t) => t.name) : [],
    };
  }
}
