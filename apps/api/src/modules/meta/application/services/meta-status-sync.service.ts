import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { CampaignRepository } from '../../../../infrastructure/database/repositories/campaign.repository';
import { AdSetRepository } from '../../../../infrastructure/database/repositories/ad-set.repository';
import { AdRepository } from '../../../../infrastructure/database/repositories/ad.repository';
import { MetaStatusRepository } from '../../../../infrastructure/database/repositories/meta-status.repository';
import { StatusSyncHistoryRepository } from '../../../../infrastructure/database/repositories/status-sync-history.repository';
import { MetaGraphStatusClient } from './meta-graph-status-client';
import { StatusSyncHistoryDto } from './meta-status.dto';
import { MetaStatusMapper } from './meta-status.mapper';
import { StatusSyncHistory } from '@prisma/client';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { CLOCK_PROVIDER } from '../../../../infrastructure/security/security.module';
import { IEncryption } from '../../../../common/ports/encryption.interface';
import { ENCRYPTION_SERVICE } from '../../../../infrastructure/security/security.module';

@Injectable()
export class MetaStatusSyncService {
  constructor(
    private readonly connectionRepo: MetaConnectionRepository,
    private readonly campaignRepo: CampaignRepository,
    private readonly adSetRepo: AdSetRepository,
    private readonly adRepo: AdRepository,
    private readonly statusRepo: MetaStatusRepository,
    private readonly historyRepo: StatusSyncHistoryRepository,
    private readonly graphStatusClient: MetaGraphStatusClient,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
    @Inject(ENCRYPTION_SERVICE)
    private readonly encryptionService: IEncryption,
  ) {}

  async getHistory(workspaceId: string): Promise<StatusSyncHistoryDto[]> {
    const list = await this.historyRepo.findHistoryByWorkspaceId(workspaceId);
    return list.map(MetaStatusMapper.toHistoryDto);
  }

  async sync(workspaceId: string): Promise<StatusSyncHistoryDto> {
    const startedAt = this.clockProvider.now();
    const history: StatusSyncHistory = {
      id: '',
      workspaceId,
      status: 'RUNNING',
      startedAt,
      finishedAt: null,
      recordsProcessed: 0,
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

      let processed = 0;
      let updated = 0;

      const campaigns = await this.campaignRepo.findByWorkspaceId(workspaceId);
      const publishedCampaigns = campaigns.filter((c) => c.externalCampaignId);

      for (const campaign of publishedCampaigns) {
        processed++;
        const remoteCampaign = await this.graphStatusClient.fetchCampaignStatus(
          campaign.externalCampaignId!,
          accessToken,
        );

        const statusDetail = await this.statusRepo.findCampaignStatusDetail(campaign.id);
        const existingPayload = statusDetail?.statusRawPayload as any;
        const hasChanged =
          !existingPayload ||
          existingPayload.updated_time !== remoteCampaign.updated_time ||
          existingPayload.status !== remoteCampaign.status;

        if (hasChanged) {
          const effectiveStatus = remoteCampaign.effective_status || 'UNKNOWN';
          const reviewStatus = remoteCampaign.review_feedback ? 'REJECTED' : 'APPROVED';
          const deliveryStatus = remoteCampaign.delivery_info?.status || 'UNKNOWN';

          await this.statusRepo.updateCampaignStatus(
            campaign.id,
            effectiveStatus,
            reviewStatus,
            deliveryStatus,
            remoteCampaign,
            this.clockProvider.now(),
          );
          updated++;
        }

        const adsets = await this.adSetRepo.findByCampaignId(campaign.id);
        const publishedAdsets = adsets.filter((a) => a.externalAdSetId);

        for (const adset of publishedAdsets) {
          processed++;
          const remoteAdset = await this.graphStatusClient.fetchAdSetStatus(
            adset.externalAdSetId!,
            accessToken,
          );

          const adsetDetail = await this.statusRepo.findAdSetStatusDetail(adset.id);
          const existingAdSetPayload = adsetDetail?.statusRawPayload as any;
          const adSetChanged =
            !existingAdSetPayload ||
            existingAdSetPayload.updated_time !== remoteAdset.updated_time ||
            existingAdSetPayload.status !== remoteAdset.status;

          if (adSetChanged) {
            const effectiveStatus = remoteAdset.effective_status || 'UNKNOWN';
            const reviewStatus = remoteAdset.review_feedback ? 'REJECTED' : 'APPROVED';
            const deliveryStatus = remoteAdset.delivery_info?.status || 'UNKNOWN';

            await this.statusRepo.updateAdSetStatus(
              adset.id,
              effectiveStatus,
              reviewStatus,
              deliveryStatus,
              remoteAdset,
              this.clockProvider.now(),
            );
            updated++;
          }

          const ads = await this.adRepo.findByAdSetId(adset.id);
          const publishedAds = ads.filter((a) => a.externalAdId);

          for (const ad of publishedAds) {
            processed++;
            const remoteAd = await this.graphStatusClient.fetchAdStatus(
              ad.externalAdId!,
              accessToken,
            );

            const adDetail = await this.statusRepo.findAdStatusDetail(ad.id);
            const existingAdPayload = adDetail?.statusRawPayload as any;
            const adChanged =
              !existingAdPayload ||
              existingAdPayload.updated_time !== remoteAd.updated_time ||
              existingAdPayload.status !== remoteAd.status;

            if (adChanged) {
              const effectiveStatus = remoteAd.effective_status || 'UNKNOWN';
              const reviewStatus = remoteAd.review_feedback ? 'REJECTED' : 'APPROVED';
              const deliveryStatus = remoteAd.delivery_info?.status || 'UNKNOWN';

              await this.statusRepo.updateAdStatus(
                ad.id,
                effectiveStatus,
                reviewStatus,
                deliveryStatus,
                remoteAd,
                this.clockProvider.now(),
              );
              updated++;
            }
          }
        }
      }

      const finishedAt = this.clockProvider.now();
      savedHistory.status = 'SUCCESS';
      savedHistory.finishedAt = finishedAt;
      savedHistory.recordsProcessed = processed;
      savedHistory.recordsUpdated = updated;
      savedHistory.duration = Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000);

      const finalHistory = await this.historyRepo.save(savedHistory);
      return MetaStatusMapper.toHistoryDto(finalHistory);
    } catch (err: any) {
      const finishedAt = this.clockProvider.now();
      savedHistory.status = 'FAILED';
      savedHistory.finishedAt = finishedAt;
      savedHistory.errorMessage = err.message || 'Unknown Status Sync Error';
      savedHistory.duration = Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000);

      const finalHistory = await this.historyRepo.save(savedHistory);
      return MetaStatusMapper.toHistoryDto(finalHistory);
    }
  }
}
