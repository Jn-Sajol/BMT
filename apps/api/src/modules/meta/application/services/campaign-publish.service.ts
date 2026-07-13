import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CampaignRepository } from '../../../../infrastructure/database/repositories/campaign.repository';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { MetaAdAccountRepository } from '../../../../infrastructure/database/repositories/meta-ad-account.repository';
import { CampaignPublisher } from './campaign-publisher';
import { IEncryption } from '../../../../common/ports/encryption.interface';
import { ENCRYPTION_SERVICE, CLOCK_PROVIDER } from '../../../../infrastructure/security/security.module';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { CampaignResponseDto } from '../../../../common/dto/campaign.dto';
import { CampaignMapper } from '../../../../common/mappers/campaign.mapper';
import {
  CampaignAlreadyPublishedException,
  MetaConnectionNotFoundException,
  WorkspaceMismatchException,
  CampaignValidationException,
} from '../../../../common/exceptions/campaign-publish.exceptions';

@Injectable()
export class CampaignPublishService {
  constructor(
    private readonly campaignRepo: CampaignRepository,
    private readonly metaConnectionRepo: MetaConnectionRepository,
    private readonly adAccountRepo: MetaAdAccountRepository,
    private readonly publisher: CampaignPublisher,
    @Inject(ENCRYPTION_SERVICE)
    private readonly encryptionService: IEncryption,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
  ) {}

  async publish(campaignId: string, workspaceId: string, userId: string): Promise<CampaignResponseDto> {
    const campaign = await this.campaignRepo.findById(campaignId);
    if (!campaign) {
      throw new NotFoundException('Campaign draft not found');
    }

    if (campaign.workspaceId !== workspaceId) {
      throw new WorkspaceMismatchException();
    }

    if (campaign.isPublished || campaign.status === 'PUBLISHED') {
      throw new CampaignAlreadyPublishedException(campaignId);
    }

    const connection = await this.metaConnectionRepo.findByWorkspaceId(workspaceId);
    if (!connection || connection.status !== 'ACTIVE') {
      throw new MetaConnectionNotFoundException(workspaceId);
    }

    const adAccount = await this.adAccountRepo.findById(campaign.metaAdAccountId);
    if (!adAccount) {
      throw new CampaignValidationException('Associated Meta Ad Account context not found internally');
    }

    const decryptedAccessToken = this.encryptionService.decrypt(connection.encryptedAccessToken);
    if (!decryptedAccessToken) {
      throw new CampaignValidationException('Failed to decrypt workspace Meta access token');
    }

    const result = await this.publisher.publish(campaign, decryptedAccessToken, adAccount.externalId);

    const now = this.clockProvider.now();
    const updated = {
      ...campaign,
      status: 'PUBLISHED' as const,
      isPublished: true,
      publishedAt: now,
      publishedBy: userId,
      externalCampaignId: result.externalCampaignId,
      publishResponse: result.rawResponse as any,
      updatedAt: now,
      updatedBy: userId,
    };

    const currentLabels = (campaign as any).labels ? (campaign as any).labels.map((l: any) => l.name) : [];
    const currentTags = (campaign as any).tags ? (campaign as any).tags.map((t: any) => t.name) : [];

    const saved = await this.campaignRepo.save(updated, currentLabels, currentTags);

    return CampaignMapper.toResponse(saved);
  }
}
