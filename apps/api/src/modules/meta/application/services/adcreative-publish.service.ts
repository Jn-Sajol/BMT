import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AdCreativeRepository } from '../../../../infrastructure/database/repositories/ad-creative.repository';
import { CampaignRepository } from '../../../../infrastructure/database/repositories/campaign.repository';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { MetaAdAccountRepository } from '../../../../infrastructure/database/repositories/meta-ad-account.repository';
import { MetaPageRepository } from '../../../../infrastructure/database/repositories/meta-page.repository';
import { MetaInstagramAccountRepository } from '../../../../infrastructure/database/repositories/meta-instagram.repository';
import { AdCreativePublisher } from './adcreative-publisher';
import { IEncryption } from '../../../../common/ports/encryption.interface';
import { ENCRYPTION_SERVICE, CLOCK_PROVIDER } from '../../../../infrastructure/security/security.module';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { AdCreativeResponseDto } from '../../../../application/adcreative/common/adcreative.dto';
import { AdCreativeMapper } from '../../../../application/adcreative/common/adcreative.mapper';
import {
  MetaConnectionNotFoundException,
  WorkspaceMismatchException,
} from '../../../../common/exceptions/campaign-publish.exceptions';
import {
  CreativeAlreadyPublishedException,
  CreativeValidationException,
  ParentCampaignNotPublishedException,
} from '../../../../common/exceptions/adcreative-publish.exceptions';

@Injectable()
export class AdCreativePublishService {
  constructor(
    private readonly adCreativeRepo: AdCreativeRepository,
    private readonly campaignRepo: CampaignRepository,
    private readonly metaConnectionRepo: MetaConnectionRepository,
    private readonly adAccountRepo: MetaAdAccountRepository,
    private readonly pageRepo: MetaPageRepository,
    private readonly instagramRepo: MetaInstagramAccountRepository,
    private readonly publisher: AdCreativePublisher,
    @Inject(ENCRYPTION_SERVICE)
    private readonly encryptionService: IEncryption,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
  ) {}

  async publish(creativeId: string, workspaceId: string, userId: string): Promise<AdCreativeResponseDto> {
    const adCreative = await this.adCreativeRepo.findById(creativeId);
    if (!adCreative) {
      throw new NotFoundException('Ad Creative draft not found');
    }

    const campaign = await this.campaignRepo.findById(adCreative.campaignId);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new WorkspaceMismatchException();
    }

    if (adCreative.publishedAt || adCreative.externalCreativeId) {
      throw new CreativeAlreadyPublishedException(creativeId);
    }

    if (!campaign.isPublished || !campaign.externalCampaignId) {
      throw new ParentCampaignNotPublishedException(campaign.id);
    }

    const connection = await this.metaConnectionRepo.findByWorkspaceId(workspaceId);
    if (!connection || connection.status !== 'ACTIVE') {
      throw new MetaConnectionNotFoundException(workspaceId);
    }

    const decryptedAccessToken = this.encryptionService.decrypt(connection.encryptedAccessToken);
    if (!decryptedAccessToken) {
      throw new CreativeValidationException('Failed to decrypt workspace Meta access token');
    }

    const adAccount = await this.adAccountRepo.findById(campaign.metaAdAccountId);
    if (!adAccount) {
      throw new CreativeValidationException('Associated Meta Ad Account context not found internally');
    }

    let pageExternalId = '';
    if (adCreative.facebookPageId) {
      const page = await this.pageRepo.findById(adCreative.facebookPageId);
      if (!page || page.workspaceId !== workspaceId) {
        throw new CreativeValidationException('Associated Facebook Page belongs to a different workspace');
      }
      pageExternalId = page.externalId;
    } else {
      throw new CreativeValidationException('Ad Creative requires an associated Facebook Page to publish');
    }

    let instagramExternalId: string | null = null;
    if (adCreative.instagramAccountId) {
      const insta = await this.instagramRepo.findById(adCreative.instagramAccountId);
      if (insta && insta.workspaceId === workspaceId) {
        instagramExternalId = insta.externalId;
      }
    }

    const result = await this.publisher.publish(
      adCreative,
      pageExternalId,
      instagramExternalId,
      decryptedAccessToken,
      adAccount.externalId,
    );

    const now = this.clockProvider.now();
    const updated = {
      ...adCreative,
      status: 'PUBLISHED' as const,
      publishedAt: now,
      publishedBy: userId,
      externalCreativeId: result.externalCreativeId,
      publishResponse: result.rawResponse as any,
      updatedAt: now,
      updatedBy: userId,
    };

    const currentLabels = (adCreative as any).labels ? (adCreative as any).labels.map((l: any) => l.name) : [];
    const currentTags = (adCreative as any).tags ? (adCreative as any).tags.map((t: any) => t.name) : [];

    const saved = await this.adCreativeRepo.save(updated, currentLabels, currentTags);

    return AdCreativeMapper.toResponse(saved);
  }
}
