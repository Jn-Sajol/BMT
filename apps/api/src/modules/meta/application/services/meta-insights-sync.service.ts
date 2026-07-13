import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { CampaignRepository } from '../../../../infrastructure/database/repositories/campaign.repository';
import { AdSetRepository } from '../../../../infrastructure/database/repositories/ad-set.repository';
import { AdRepository } from '../../../../infrastructure/database/repositories/ad.repository';
import { CampaignInsightRepository } from '../../../../infrastructure/database/repositories/campaign-insight.repository';
import { AdSetInsightRepository } from '../../../../infrastructure/database/repositories/adset-insight.repository';
import { AdInsightRepository } from '../../../../infrastructure/database/repositories/ad-insight.repository';
import { InsightSyncHistoryRepository } from '../../../../infrastructure/database/repositories/insight-sync-history.repository';
import { MetaGraphInsightsClient } from './meta-graph-insights-client';
import { SyncInsightsDto, SyncHistoryResponseDto } from './meta-insights.dto';
import { MetaInsightsMapper } from './meta-insights.mapper';
import { InsightSyncHistory } from '@prisma/client';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { CLOCK_PROVIDER } from '../../../../infrastructure/security/security.module';
import { IEncryption } from '../../../../common/ports/encryption.interface';
import { ENCRYPTION_SERVICE } from '../../../../infrastructure/security/security.module';

@Injectable()
export class MetaInsightsSyncService {
  private readonly fields = [
    'impressions',
    'reach',
    'frequency',
    'clicks',
    'ctr',
    'cpc',
    'cpm',
    'spend',
    'actions',
    'action_values',
    'video_play_actions',
    'video_p25_watched_actions',
    'video_p50_watched_actions',
    'video_p75_watched_actions',
    'video_p95_watched_actions',
    'video_p100_watched_actions',
    'date_start',
    'date_stop',
  ];

  constructor(
    private readonly connectionRepo: MetaConnectionRepository,
    private readonly campaignRepo: CampaignRepository,
    private readonly adSetRepo: AdSetRepository,
    private readonly adRepo: AdRepository,
    private readonly campaignInsightRepo: CampaignInsightRepository,
    private readonly adSetInsightRepo: AdSetInsightRepository,
    private readonly adInsightRepo: AdInsightRepository,
    private readonly historyRepo: InsightSyncHistoryRepository,
    private readonly insightsClient: MetaGraphInsightsClient,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
    @Inject(ENCRYPTION_SERVICE)
    private readonly encryptionService: IEncryption,
  ) {}

  async sync(dto: SyncInsightsDto, workspaceId: string): Promise<SyncHistoryResponseDto> {
    const startedAt = this.clockProvider.now();
    const history: InsightSyncHistory = {
      id: '',
      workspaceId,
      status: 'RUNNING',
      startedAt,
      finishedAt: null,
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      duration: null,
      errorMessage: null,
    };

    const savedHistory = await this.historyRepo.save(history);

    try {
      const connection = await this.connectionRepo.findByWorkspaceId(workspaceId);
      if (!connection || connection.status !== 'ACTIVE') {
        throw new NotFoundException('Active Meta Connection not found for workspace.');
      }

      const accessToken = this.encryptionService.decrypt(connection.encryptedAccessToken);
      if (!accessToken) {
        throw new Error('Failed to decrypt Meta Connection Access Token.');
      }

      const params: any = {
        time_increment: 1,
        limit: 100,
      };

      if (dto.since && dto.until) {
        params.time_range = { since: dto.since, until: dto.until };
      } else {
        params.date_preset = dto.datePreset || 'yesterday';
      }

      let processed = 0;
      let created = 0;
      let updated = 0;

      const campaigns = await this.campaignRepo.findByWorkspaceId(workspaceId);
      const publishedCampaigns = campaigns.filter((c) => c.externalCampaignId);

      for (const campaign of publishedCampaigns) {
        // Sync Campaign Insights
        let afterCursor: string | undefined = undefined;
        let hasMore = true;

        while (hasMore) {
          const res = await this.insightsClient.fetchInsights(
            campaign.externalCampaignId!,
            accessToken,
            this.fields,
            { ...params, after: afterCursor },
          );

          for (const item of res.data) {
            const normalized = this.normalizeItem(item, workspaceId);
            const { isNew } = await this.campaignInsightRepo.upsert({
              ...normalized,
              campaignId: campaign.id,
            });

            processed++;
            if (isNew) created++;
            else updated++;
          }

          afterCursor = res.paging?.cursors?.after;
          hasMore = !!afterCursor;
        }

        // Fetch AdSets for this Campaign
        const adsets = await this.adSetRepo.findByCampaignId(campaign.id);
        const publishedAdsets = adsets.filter((a) => a.externalAdSetId);

        for (const adset of publishedAdsets) {
          // Sync AdSet Insights
          let adsetAfterCursor: string | undefined = undefined;
          let adsetHasMore = true;

          while (adsetHasMore) {
            const res = await this.insightsClient.fetchInsights(
              adset.externalAdSetId!,
              accessToken,
              this.fields,
              { ...params, after: adsetAfterCursor },
            );

            for (const item of res.data) {
              const normalized = this.normalizeItem(item, workspaceId);
              const { isNew } = await this.adSetInsightRepo.upsert({
                ...normalized,
                adSetId: adset.id,
              });

              processed++;
              if (isNew) created++;
              else updated++;
            }

            adsetAfterCursor = res.paging?.cursors?.after;
            adsetHasMore = !!adsetAfterCursor;
          }

          // Fetch Ads for this AdSet
          const ads = await this.adRepo.findByAdSetId(adset.id);
          const publishedAds = ads.filter((a) => a.externalAdId);

          for (const ad of publishedAds) {
            // Sync Ad Insights
            let adAfterCursor: string | undefined = undefined;
            let adHasMore = true;

            while (adHasMore) {
              const res = await this.insightsClient.fetchInsights(
                ad.externalAdId!,
                accessToken,
                this.fields,
                { ...params, after: adAfterCursor },
              );

              for (const item of res.data) {
                const normalized = this.normalizeItem(item, workspaceId);
                const { isNew } = await this.adInsightRepo.upsert({
                  ...normalized,
                  adId: ad.id,
                });

                processed++;
                if (isNew) created++;
                else updated++;
              }

              adAfterCursor = res.paging?.cursors?.after;
              adHasMore = !!adAfterCursor;
            }
          }
        }
      }

      const finishedAt = this.clockProvider.now();
      savedHistory.status = 'SUCCESS';
      savedHistory.finishedAt = finishedAt;
      savedHistory.recordsProcessed = processed;
      savedHistory.recordsCreated = created;
      savedHistory.recordsUpdated = updated;
      savedHistory.duration = Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000);

      const finalHistory = await this.historyRepo.save(savedHistory);
      return MetaInsightsMapper.toSyncHistoryResponse(finalHistory);
    } catch (err: any) {
      const finishedAt = this.clockProvider.now();
      savedHistory.status = 'FAILED';
      savedHistory.finishedAt = finishedAt;
      savedHistory.errorMessage = err.message || 'Unknown Sync Error';
      savedHistory.duration = Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000);

      const finalHistory = await this.historyRepo.save(savedHistory);
      return MetaInsightsMapper.toSyncHistoryResponse(finalHistory);
    }
  }

  private normalizeItem(item: any, workspaceId: string) {
    const parseAction = (arr: any[], type: string): number => {
      const match = arr?.find((a) => a.action_type === type);
      return match ? Math.round(Number(match.value)) : 0;
    };

    const parseActionFloat = (arr: any[], type: string): number => {
      const match = arr?.find((a) => a.action_type === type);
      return match ? Number(match.value) : 0.0;
    };

    const actions = item.actions || [];
    const actionValues = item.action_values || [];

    const purchase = parseAction(actions, 'purchase') || parseAction(actions, 'offsite_conversion.fb_pixel_purchase');
    const purchaseValue = parseActionFloat(actionValues, 'purchase') || parseActionFloat(actionValues, 'offsite_conversion.fb_pixel_purchase');
    const addToCart = parseAction(actions, 'add_to_cart') || parseAction(actions, 'offsite_conversion.fb_pixel_add_to_cart');
    const initiatedCheckout = parseAction(actions, 'initiate_checkout') || parseAction(actions, 'offsite_conversion.fb_pixel_initiate_checkout');
    const landingPageViews = parseAction(actions, 'landing_page_view');

    const videoViews = parseAction(item.video_play_actions || [], 'video_play');
    const video25 = parseAction(item.video_p25_watched_actions || [], 'video_p25_watched');
    const video50 = parseAction(item.video_p50_watched_actions || [], 'video_p50_watched');
    const video75 = parseAction(item.video_p75_watched_actions || [], 'video_p75_watched');
    const video95 = parseAction(item.video_p95_watched_actions || [], 'video_p95_watched');
    const video100 = parseAction(item.video_p100_watched_actions || [], 'video_p100_watched');

    const comments = parseAction(actions, 'comment');
    const likes = parseAction(actions, 'like') || parseAction(actions, 'post_reaction');
    const shares = parseAction(actions, 'share');
    const saves = parseAction(actions, 'save');

    return {
      workspaceId,
      facebookObjectId: item.campaign_id || item.adset_id || item.ad_id,
      provider: 'meta',
      date: new Date(item.date_start),
      impressions: Number(item.impressions) || 0,
      reach: Number(item.reach) || 0,
      frequency: Number(item.frequency) || 0.0,
      clicks: Number(item.clicks) || 0,
      uniqueClicks: Number(item.unique_clicks) || 0,
      inlineLinkClicks: Number(item.inline_link_clicks) || 0,
      ctr: Number(item.ctr) || 0.0,
      cpc: Number(item.cpc) || 0.0,
      cpm: Number(item.cpm) || 0.0,
      spend: Number(item.spend) || 0.0,
      purchase,
      purchaseValue,
      addToCart,
      initiatedCheckout,
      landingPageViews,
      videoViews,
      video25,
      video50,
      video75,
      video95,
      video100,
      engagement: comments + likes + shares + saves,
      comments,
      likes,
      shares,
      saves,
      rawPayload: item,
      syncedAt: this.clockProvider.now(),
    };
  }
}
