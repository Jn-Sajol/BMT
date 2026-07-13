import { AdSet, AdSetLabel, AdSetTag } from '@prisma/client';
import { AdSetResponseDto } from './adset.dto';

export class AdSetMapper {
  static toResponse(
    entity: AdSet & { labels?: AdSetLabel[]; tags?: AdSetTag[] },
  ): AdSetResponseDto {
    return {
      id: entity.id,
      campaignId: entity.campaignId,
      name: entity.name,
      status: entity.status,
      optimizationGoal: entity.optimizationGoal,
      billingEvent: entity.billingEvent,
      bidStrategy: entity.bidStrategy || undefined,
      dailyBudget: entity.dailyBudget || undefined,
      lifetimeBudget: entity.lifetimeBudget || undefined,
      startTime: entity.startTime.toISOString(),
      endTime: entity.endTime ? entity.endTime.toISOString() : undefined,
      attributionSetting: entity.attributionSetting || undefined,
      targeting: entity.targeting,
      promotedObject: entity.promotedObject || undefined,
      metaPixelId: entity.metaPixelId || undefined,
      instagramAccountId: entity.instagramAccountId || undefined,
      facebookPageId: entity.facebookPageId || undefined,
      draftVersion: entity.draftVersion,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      publishedAt: entity.publishedAt ? entity.publishedAt.toISOString() : undefined,
      publishedBy: entity.publishedBy || undefined,
      externalAdSetId: entity.externalAdSetId || undefined,
      labels: entity.labels ? entity.labels.map((l) => l.name) : [],
      tags: entity.tags ? entity.tags.map((t) => t.name) : [],
    };
  }
}
