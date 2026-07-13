import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CampaignLifecycleRepository } from '../../../../infrastructure/database/repositories/campaign-lifecycle.repository';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { CampaignLifecyclePublisher } from './campaign-lifecycle-publisher';
import { UpdateCampaignDto, CampaignLifecycleHistoryDto } from './campaign-lifecycle.dto';
import { CampaignLifecycleMapper } from './campaign-lifecycle.mapper';
import {
  CampaignNotPublishedException,
  CampaignArchivedException,
  CampaignAlreadyPausedException,
  CampaignAlreadyActiveException,
  MetaOperationFailedException,
} from '../../../../common/exceptions/campaign-lifecycle.exceptions';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { CLOCK_PROVIDER } from '../../../../infrastructure/security/security.module';
import { IEncryption } from '../../../../common/ports/encryption.interface';
import { ENCRYPTION_SERVICE } from '../../../../infrastructure/security/security.module';
import { CampaignStatus } from '@prisma/client';

@Injectable()
export class CampaignLifecycleService {
  constructor(
    private readonly lifecycleRepo: CampaignLifecycleRepository,
    private readonly connectionRepo: MetaConnectionRepository,
    private readonly publisher: CampaignLifecyclePublisher,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
    @Inject(ENCRYPTION_SERVICE)
    private readonly encryptionService: IEncryption,
  ) {}

  async updateCampaign(
    campaignId: string,
    workspaceId: string,
    userId: string,
    dto: UpdateCampaignDto,
  ): Promise<CampaignLifecycleHistoryDto> {
    const campaign = await this.loadAndValidateCampaign(campaignId, workspaceId);

    const accessToken = await this.getAccessToken(workspaceId);

    try {
      const response = await this.publisher.updateCampaign(
        campaign.externalCampaignId!,
        dto,
        accessToken,
      );

      await this.lifecycleRepo.updateCampaignAttributes(
        campaignId,
        dto.name,
        dto.specialAdCategories,
        dto.buyingType,
        userId,
      );

      const history = await this.lifecycleRepo.insertHistory(
        campaignId,
        'UPDATE',
        campaign.status,
        campaign.status,
        userId,
        this.clockProvider.now(),
        response,
      );

      return CampaignLifecycleMapper.toHistoryDto(history);
    } catch (err: any) {
      throw new MetaOperationFailedException(err.message);
    }
  }

  async pauseCampaign(
    campaignId: string,
    workspaceId: string,
    userId: string,
  ): Promise<CampaignLifecycleHistoryDto> {
    const campaign = await this.loadAndValidateCampaign(campaignId, workspaceId);

    const currentEffective = campaign.statusDetail?.effectiveStatus || 'ACTIVE';
    if (campaign.status === CampaignStatus.ARCHIVED) {
      throw new CampaignArchivedException(campaignId);
    }
    if (currentEffective === 'PAUSED' || currentEffective === 'CAMPAIGN_PAUSED') {
      throw new CampaignAlreadyPausedException(campaignId);
    }

    const accessToken = await this.getAccessToken(workspaceId);

    try {
      const response = await this.publisher.pauseCampaign(
        campaign.externalCampaignId!,
        accessToken,
      );

      await this.lifecycleRepo.updateCampaignStatus(
        campaignId,
        CampaignStatus.PUBLISHED,
        'PAUSED',
        this.clockProvider.now(),
        response,
        userId,
      );

      const history = await this.lifecycleRepo.insertHistory(
        campaignId,
        'PAUSE',
        currentEffective,
        'PAUSED',
        userId,
        this.clockProvider.now(),
        response,
      );

      return CampaignLifecycleMapper.toHistoryDto(history);
    } catch (err: any) {
      throw new MetaOperationFailedException(err.message);
    }
  }

  async resumeCampaign(
    campaignId: string,
    workspaceId: string,
    userId: string,
  ): Promise<CampaignLifecycleHistoryDto> {
    const campaign = await this.loadAndValidateCampaign(campaignId, workspaceId);

    const currentEffective = campaign.statusDetail?.effectiveStatus || 'PAUSED';
    if (campaign.status === CampaignStatus.ARCHIVED) {
      throw new CampaignArchivedException(campaignId);
    }
    if (currentEffective === 'ACTIVE') {
      throw new CampaignAlreadyActiveException(campaignId);
    }

    const accessToken = await this.getAccessToken(workspaceId);

    try {
      const response = await this.publisher.resumeCampaign(
        campaign.externalCampaignId!,
        accessToken,
      );

      await this.lifecycleRepo.updateCampaignStatus(
        campaignId,
        CampaignStatus.PUBLISHED,
        'ACTIVE',
        this.clockProvider.now(),
        response,
        userId,
      );

      const history = await this.lifecycleRepo.insertHistory(
        campaignId,
        'RESUME',
        currentEffective,
        'ACTIVE',
        userId,
        this.clockProvider.now(),
        response,
      );

      return CampaignLifecycleMapper.toHistoryDto(history);
    } catch (err: any) {
      throw new MetaOperationFailedException(err.message);
    }
  }

  async archiveCampaign(
    campaignId: string,
    workspaceId: string,
    userId: string,
  ): Promise<CampaignLifecycleHistoryDto> {
    const campaign = await this.loadAndValidateCampaign(campaignId, workspaceId);

    const currentEffective = campaign.statusDetail?.effectiveStatus || 'ACTIVE';
    if (campaign.status === CampaignStatus.ARCHIVED) {
      throw new CampaignArchivedException(campaignId);
    }

    const accessToken = await this.getAccessToken(workspaceId);

    try {
      const response = await this.publisher.archiveCampaign(
        campaign.externalCampaignId!,
        accessToken,
      );

      await this.lifecycleRepo.updateCampaignStatus(
        campaignId,
        CampaignStatus.ARCHIVED,
        'ARCHIVED',
        this.clockProvider.now(),
        response,
        userId,
      );

      const history = await this.lifecycleRepo.insertHistory(
        campaignId,
        'ARCHIVE',
        currentEffective,
        'ARCHIVED',
        userId,
        this.clockProvider.now(),
        response,
      );

      return CampaignLifecycleMapper.toHistoryDto(history);
    } catch (err: any) {
      throw new MetaOperationFailedException(err.message);
    }
  }

  private async loadAndValidateCampaign(campaignId: string, workspaceId: string) {
    const campaign = await this.lifecycleRepo.findById(campaignId);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new NotFoundException('Campaign not found.');
    }

    if (!campaign.isPublished || !campaign.externalCampaignId) {
      throw new CampaignNotPublishedException(campaignId);
    }

    if (campaign.status === CampaignStatus.ARCHIVED) {
      throw new CampaignArchivedException(campaignId);
    }

    return campaign;
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
