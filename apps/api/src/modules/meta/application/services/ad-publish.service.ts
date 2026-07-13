import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AdRepository } from '../../../../infrastructure/database/repositories/ad.repository';
import { CampaignRepository } from '../../../../infrastructure/database/repositories/campaign.repository';
import { AdSetRepository } from '../../../../infrastructure/database/repositories/ad-set.repository';
import { AdCreativeRepository } from '../../../../infrastructure/database/repositories/ad-creative.repository';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { MetaAdAccountRepository } from '../../../../infrastructure/database/repositories/meta-ad-account.repository';
import { MetaAdPublisher } from './ad-publisher';
import { IEncryption } from '../../../../common/ports/encryption.interface';
import { ENCRYPTION_SERVICE, CLOCK_PROVIDER } from '../../../../infrastructure/security/security.module';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { AdResponseDto } from '../../../../application/ad/common/ad.dto';
import { AdMapper } from '../../../../application/ad/common/ad.mapper';
import {
  MetaConnectionNotFoundException,
  WorkspaceMismatchException,
} from '../../../../common/exceptions/campaign-publish.exceptions';
import {
  AdAlreadyPublishedException,
  ParentCampaignNotPublishedException,
  ParentAdSetNotPublishedException,
  CreativeNotPublishedException,
  AdPublishValidationException,
} from '../../../../common/exceptions/ad-publish.exceptions';

@Injectable()
export class AdPublishService {
  constructor(
    private readonly adRepo: AdRepository,
    private readonly campaignRepo: CampaignRepository,
    private readonly adSetRepo: AdSetRepository,
    private readonly creativeRepo: AdCreativeRepository,
    private readonly metaConnectionRepo: MetaConnectionRepository,
    private readonly adAccountRepo: MetaAdAccountRepository,
    private readonly publisher: MetaAdPublisher,
    @Inject(ENCRYPTION_SERVICE)
    private readonly encryptionService: IEncryption,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
  ) {}

  async publish(adId: string, workspaceId: string, userId: string): Promise<AdResponseDto> {
    const ad = await this.adRepo.findById(adId);
    if (!ad || ad.workspaceId !== workspaceId) {
      throw new NotFoundException('Ad draft not found');
    }

    const campaign = await this.campaignRepo.findById(ad.campaignId);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new WorkspaceMismatchException();
    }

    const adSet = await this.adSetRepo.findById(ad.adSetId);
    if (!adSet || adSet.campaignId !== campaign.id) {
      throw new AdPublishValidationException('Parent Ad Set not found or mismatched');
    }

    const creative = await this.creativeRepo.findById(ad.creativeId);
    if (!creative || creative.campaignId !== campaign.id) {
      throw new AdPublishValidationException('Ad Creative not found or mismatched');
    }

    if (ad.publishedAt || ad.externalAdId) {
      throw new AdAlreadyPublishedException(adId);
    }

    if (!campaign.isPublished || !campaign.externalCampaignId) {
      throw new ParentCampaignNotPublishedException(campaign.id);
    }

    if (!adSet.externalAdSetId) {
      throw new ParentAdSetNotPublishedException(adSet.id);
    }

    if (!creative.externalCreativeId) {
      throw new CreativeNotPublishedException(creative.id);
    }

    const connection = await this.metaConnectionRepo.findByWorkspaceId(workspaceId);
    if (!connection || connection.status !== 'ACTIVE') {
      throw new MetaConnectionNotFoundException(workspaceId);
    }

    const decryptedAccessToken = this.encryptionService.decrypt(connection.encryptedAccessToken);
    if (!decryptedAccessToken) {
      throw new AdPublishValidationException('Failed to decrypt workspace Meta access token');
    }

    const adAccount = await this.adAccountRepo.findById(campaign.metaAdAccountId);
    if (!adAccount) {
      throw new AdPublishValidationException('Associated Meta Ad Account context not found internally');
    }

    const result = await this.publisher.publish(
      ad,
      adSet.externalAdSetId,
      creative.externalCreativeId,
      decryptedAccessToken,
      adAccount.externalId,
    );

    const now = this.clockProvider.now();
    const updated = {
      ...ad,
      status: 'PUBLISHED' as const,
      publishedAt: now,
      publishedBy: userId,
      externalAdId: result.externalAdId,
      publishResponse: result.rawResponse as any,
      updatedAt: now,
      updatedBy: userId,
    };

    const currentLabels = (ad as any).labels ? (ad as any).labels.map((l: any) => l.name) : [];
    const currentTags = (ad as any).tags ? (ad as any).tags.map((t: any) => t.name) : [];

    const saved = await this.adRepo.save(updated, currentLabels, currentTags);

    return AdMapper.toResponse(saved);
  }
}
