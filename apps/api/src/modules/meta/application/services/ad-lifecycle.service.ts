import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AdLifecycleRepository } from '../../../../infrastructure/database/repositories/ad-lifecycle.repository';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { AdCreativeRepository } from '../../../../infrastructure/database/repositories/ad-creative.repository';
import { CampaignRepository } from '../../../../infrastructure/database/repositories/campaign.repository';
import { AdLifecyclePublisher } from './ad-lifecycle-publisher';
import { UpdateAdDto, AdLifecycleHistoryDto } from './ad-lifecycle.dto';
import { AdLifecycleMapper } from './ad-lifecycle.mapper';
import {
  AdNotPublishedException,
  AdArchivedException,
  AdAlreadyPausedException,
  AdAlreadyActiveException,
  AdRecreationRequiredException,
  MetaOperationFailedException,
} from '../../../../common/exceptions/ad-lifecycle.exceptions';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { CLOCK_PROVIDER } from '../../../../infrastructure/security/security.module';
import { IEncryption } from '../../../../common/ports/encryption.interface';
import { ENCRYPTION_SERVICE } from '../../../../infrastructure/security/security.module';
import { CampaignStatus } from '@prisma/client';

@Injectable()
export class AdLifecycleService {
  constructor(
    private readonly lifecycleRepo: AdLifecycleRepository,
    private readonly connectionRepo: MetaConnectionRepository,
    private readonly creativeRepo: AdCreativeRepository,
    private readonly campaignRepo: CampaignRepository,
    private readonly publisher: AdLifecyclePublisher,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
    @Inject(ENCRYPTION_SERVICE)
    private readonly encryptionService: IEncryption,
  ) {}

  async updateAd(
    adId: string,
    workspaceId: string,
    userId: string,
    dto: UpdateAdDto,
  ): Promise<AdLifecycleHistoryDto> {
    const ad = await this.loadAndValidateAd(adId, workspaceId);

    let externalCreativeId: string | undefined;
    if (dto.creativeId) {
      const creative = await this.creativeRepo.findById(dto.creativeId);
      if (!creative) {
        throw new NotFoundException('Target Ad Creative not found.');
      }
      const campaign = await this.campaignRepo.findById(creative.campaignId);
      if (!campaign || campaign.workspaceId !== workspaceId) {
        throw new NotFoundException('Target Ad Creative not found.');
      }
      if (!creative.externalCreativeId) {
        throw new Error('Target Ad Creative is not published to Meta.');
      }
      externalCreativeId = creative.externalCreativeId;
    }

    const accessToken = await this.getAccessToken(workspaceId);

    try {
      const response = await this.publisher.updateAd(
        ad.externalAdId!,
        {
          name: dto.name,
          creativeId: externalCreativeId,
          trackingSpecs: dto.trackingSpecs,
        },
        accessToken,
      );

      await this.lifecycleRepo.updateAdAttributes(adId, {
        name: dto.name,
        creativeId: dto.creativeId,
        trackingSpecs: dto.trackingSpecs,
        updatedBy: userId,
      });

      const history = await this.lifecycleRepo.insertHistory(
        adId,
        'UPDATE',
        ad.status,
        ad.status,
        userId,
        this.clockProvider.now(),
        response,
      );

      return AdLifecycleMapper.toHistoryDto(history);
    } catch (err: any) {
      throw new MetaOperationFailedException(err.message);
    }
  }

  async pauseAd(
    adId: string,
    workspaceId: string,
    userId: string,
  ): Promise<AdLifecycleHistoryDto> {
    const ad = await this.loadAndValidateAd(adId, workspaceId);

    const currentEffective = ad.statusDetail?.effectiveStatus || 'ACTIVE';
    if (ad.status === CampaignStatus.ARCHIVED) {
      throw new AdArchivedException(adId);
    }
    if (currentEffective === 'PAUSED' || currentEffective === 'AD_PAUSED') {
      throw new AdAlreadyPausedException(adId);
    }

    const accessToken = await this.getAccessToken(workspaceId);

    try {
      const response = await this.publisher.pauseAd(ad.externalAdId!, accessToken);

      await this.lifecycleRepo.updateAdStatus(
        adId,
        CampaignStatus.PUBLISHED,
        'PAUSED',
        this.clockProvider.now(),
        response,
        userId,
      );

      const history = await this.lifecycleRepo.insertHistory(
        adId,
        'PAUSE',
        currentEffective,
        'PAUSED',
        userId,
        this.clockProvider.now(),
        response,
      );

      return AdLifecycleMapper.toHistoryDto(history);
    } catch (err: any) {
      throw new MetaOperationFailedException(err.message);
    }
  }

  async resumeAd(
    adId: string,
    workspaceId: string,
    userId: string,
  ): Promise<AdLifecycleHistoryDto> {
    const ad = await this.loadAndValidateAd(adId, workspaceId);

    const currentEffective = ad.statusDetail?.effectiveStatus || 'PAUSED';
    if (ad.status === CampaignStatus.ARCHIVED) {
      throw new AdArchivedException(adId);
    }
    if (currentEffective === 'ACTIVE') {
      throw new AdAlreadyActiveException(adId);
    }

    const accessToken = await this.getAccessToken(workspaceId);

    try {
      const response = await this.publisher.resumeAd(ad.externalAdId!, accessToken);

      await this.lifecycleRepo.updateAdStatus(
        adId,
        CampaignStatus.PUBLISHED,
        'ACTIVE',
        this.clockProvider.now(),
        response,
        userId,
      );

      const history = await this.lifecycleRepo.insertHistory(
        adId,
        'RESUME',
        currentEffective,
        'ACTIVE',
        userId,
        this.clockProvider.now(),
        response,
      );

      return AdLifecycleMapper.toHistoryDto(history);
    } catch (err: any) {
      throw new MetaOperationFailedException(err.message);
    }
  }

  async archiveAd(
    adId: string,
    workspaceId: string,
    userId: string,
  ): Promise<AdLifecycleHistoryDto> {
    const ad = await this.loadAndValidateAd(adId, workspaceId);

    const currentEffective = ad.statusDetail?.effectiveStatus || 'ACTIVE';
    if (ad.status === CampaignStatus.ARCHIVED) {
      throw new AdArchivedException(adId);
    }

    const accessToken = await this.getAccessToken(workspaceId);

    try {
      const response = await this.publisher.archiveAd(ad.externalAdId!, accessToken);

      await this.lifecycleRepo.updateAdStatus(
        adId,
        CampaignStatus.ARCHIVED,
        'ARCHIVED',
        this.clockProvider.now(),
        response,
        userId,
      );

      const history = await this.lifecycleRepo.insertHistory(
        adId,
        'ARCHIVE',
        currentEffective,
        'ARCHIVED',
        userId,
        this.clockProvider.now(),
        response,
      );

      return AdLifecycleMapper.toHistoryDto(history);
    } catch (err: any) {
      throw new MetaOperationFailedException(err.message);
    }
  }

  private async loadAndValidateAd(adId: string, workspaceId: string) {
    const ad = await this.lifecycleRepo.findById(adId);
    if (!ad || ad.workspaceId !== workspaceId) {
      throw new NotFoundException('Ad not found.');
    }

    if (!ad.externalAdId) {
      throw new AdNotPublishedException(adId);
    }

    if (ad.status === CampaignStatus.ARCHIVED) {
      throw new AdArchivedException(adId);
    }

    return ad;
  }

  private async getAccessToken(workspaceId: string): Promise<string> {
    const connection = await this.connectionRepo.findByWorkspaceId(workspaceId);
    if (!connection || connection.status !== 'ACTIVE') {
      throw new NotFoundException('Active Meta Connection not found for workspace.');
    }

    const decrypted = this.encryptionService.decrypt(connection.encryptedAccessToken);
    if (!decrypted) {
      throw new Error('Failed to decrypt Meta connection token.');
    }

    return decrypted;
  }
}
