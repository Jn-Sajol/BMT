import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AdSetRepository } from '../../../../infrastructure/database/repositories/ad-set.repository';
import { CampaignRepository } from '../../../../infrastructure/database/repositories/campaign.repository';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { MetaAdAccountRepository } from '../../../../infrastructure/database/repositories/meta-ad-account.repository';
import { AdSetPublisher } from './adset-publisher';
import { IEncryption } from '../../../../common/ports/encryption.interface';
import { ENCRYPTION_SERVICE, CLOCK_PROVIDER } from '../../../../infrastructure/security/security.module';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { AdSetResponseDto } from '../../../../application/adset/common/adset.dto';
import { AdSetMapper } from '../../../../application/adset/common/adset.mapper';
import {
  MetaConnectionNotFoundException,
  WorkspaceMismatchException,
} from '../../../../common/exceptions/campaign-publish.exceptions';
import {
  AdSetAlreadyPublishedException,
  CampaignNotPublishedException,
  AdSetValidationException,
} from '../../../../common/exceptions/adset-publish.exceptions';

@Injectable()
export class AdSetPublishService {
  constructor(
    private readonly adSetRepo: AdSetRepository,
    private readonly campaignRepo: CampaignRepository,
    private readonly metaConnectionRepo: MetaConnectionRepository,
    private readonly adAccountRepo: MetaAdAccountRepository,
    private readonly publisher: AdSetPublisher,
    @Inject(ENCRYPTION_SERVICE)
    private readonly encryptionService: IEncryption,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
  ) {}

  async publish(adSetId: string, workspaceId: string, userId: string): Promise<AdSetResponseDto> {
    const adSet = await this.adSetRepo.findById(adSetId);
    if (!adSet) {
      throw new NotFoundException('Ad Set draft not found');
    }

    const campaign = await this.campaignRepo.findById(adSet.campaignId);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new WorkspaceMismatchException();
    }

    if (adSet.publishedAt || adSet.externalAdSetId) {
      throw new AdSetAlreadyPublishedException(adSetId);
    }

    if (!campaign.isPublished || !campaign.externalCampaignId) {
      throw new CampaignNotPublishedException(campaign.id);
    }

    const connection = await this.metaConnectionRepo.findByWorkspaceId(workspaceId);
    if (!connection || connection.status !== 'ACTIVE') {
      throw new MetaConnectionNotFoundException(workspaceId);
    }

    const decryptedAccessToken = this.encryptionService.decrypt(connection.encryptedAccessToken);
    if (!decryptedAccessToken) {
      throw new AdSetValidationException('Failed to decrypt workspace Meta access token');
    }

    const adAccount = await this.adAccountRepo.findById(campaign.metaAdAccountId);
    if (!adAccount) {
      throw new AdSetValidationException('Associated Meta Ad Account context not found internally');
    }

    const result = await this.publisher.publish(
      adSet,
      campaign.externalCampaignId,
      decryptedAccessToken,
      adAccount.externalId,
    );

    const now = this.clockProvider.now();
    const updated = {
      ...adSet,
      status: 'PUBLISHED' as const,
      publishedAt: now,
      publishedBy: userId,
      externalAdSetId: result.externalAdSetId,
      publishResponse: result.rawResponse as any,
      updatedAt: now,
      updatedBy: userId,
    };

    const currentLabels = (adSet as any).labels ? (adSet as any).labels.map((l: any) => l.name) : [];
    const currentTags = (adSet as any).tags ? (adSet as any).tags.map((t: any) => t.name) : [];

    const saved = await this.adSetRepo.save(updated, currentLabels, currentTags);

    return AdSetMapper.toResponse(saved);
  }
}
