import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { AdSetLifecycleRepository } from '../../../../infrastructure/database/repositories/adset-lifecycle.repository';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { AdSetLifecyclePublisher } from './adset-lifecycle-publisher';
import { UpdateAdSetDto, AdSetLifecycleHistoryDto } from './adset-lifecycle.dto';
import { AdSetLifecycleMapper } from './adset-lifecycle.mapper';
import {
  AdSetNotPublishedException,
  AdSetArchivedException,
  AdSetAlreadyPausedException,
  AdSetAlreadyActiveException,
  MetaOperationFailedException,
} from '../../../../common/exceptions/adset-lifecycle.exceptions';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { CLOCK_PROVIDER } from '../../../../infrastructure/security/security.module';
import { IEncryption } from '../../../../common/ports/encryption.interface';
import { ENCRYPTION_SERVICE } from '../../../../infrastructure/security/security.module';
import { CampaignStatus } from '@prisma/client';

@Injectable()
export class AdSetLifecycleService {
  constructor(
    private readonly lifecycleRepo: AdSetLifecycleRepository,
    private readonly connectionRepo: MetaConnectionRepository,
    private readonly publisher: AdSetLifecyclePublisher,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
    @Inject(ENCRYPTION_SERVICE)
    private readonly encryptionService: IEncryption,
  ) {}

  async updateAdSet(
    adSetId: string,
    workspaceId: string,
    userId: string,
    dto: UpdateAdSetDto,
  ): Promise<AdSetLifecycleHistoryDto> {
    const adset = await this.loadAndValidateAdSet(adSetId, workspaceId);

    if (dto.dailyBudget !== undefined && dto.dailyBudget <= 0) {
      throw new BadRequestException('Daily budget must be greater than 0.');
    }
    if (dto.lifetimeBudget !== undefined && dto.lifetimeBudget <= 0) {
      throw new BadRequestException('Lifetime budget must be greater than 0.');
    }

    const start = dto.startTime ? new Date(dto.startTime) : adset.startTime;
    const end = dto.endTime ? new Date(dto.endTime) : adset.endTime;
    if (end && start && end.getTime() <= start.getTime()) {
      throw new BadRequestException('End time must be greater than start time.');
    }

    const accessToken = await this.getAccessToken(workspaceId);

    try {
      const response = await this.publisher.updateAdSet(
        adset.externalAdSetId!,
        {
          ...dto,
          startTime: dto.startTime ? new Date(dto.startTime) : undefined,
          endTime: dto.endTime ? new Date(dto.endTime) : undefined,
        },
        accessToken,
      );

      await this.lifecycleRepo.updateAdSetAttributes(adSetId, {
        name: dto.name,
        dailyBudget: dto.dailyBudget,
        lifetimeBudget: dto.lifetimeBudget,
        bidStrategy: dto.bidStrategy,
        optimizationGoal: dto.optimizationGoal,
        billingEvent: dto.billingEvent,
        startTime: dto.startTime ? new Date(dto.startTime) : undefined,
        endTime: dto.endTime ? new Date(dto.endTime) : undefined,
        targeting: dto.targeting,
        updatedBy: userId,
      });

      const history = await this.lifecycleRepo.insertHistory(
        adSetId,
        'UPDATE',
        adset.status,
        adset.status,
        userId,
        this.clockProvider.now(),
        response,
      );

      return AdSetLifecycleMapper.toHistoryDto(history);
    } catch (err: any) {
      throw new MetaOperationFailedException(err.message);
    }
  }

  async pauseAdSet(
    adSetId: string,
    workspaceId: string,
    userId: string,
  ): Promise<AdSetLifecycleHistoryDto> {
    const adset = await this.loadAndValidateAdSet(adSetId, workspaceId);

    const currentEffective = adset.statusDetail?.effectiveStatus || 'ACTIVE';
    if (adset.status === CampaignStatus.ARCHIVED) {
      throw new AdSetArchivedException(adSetId);
    }
    if (currentEffective === 'PAUSED' || currentEffective === 'ADSET_PAUSED') {
      throw new AdSetAlreadyPausedException(adSetId);
    }

    const accessToken = await this.getAccessToken(workspaceId);

    try {
      const response = await this.publisher.pauseAdSet(adset.externalAdSetId!, accessToken);

      await this.lifecycleRepo.updateAdSetStatus(
        adSetId,
        CampaignStatus.PUBLISHED,
        'PAUSED',
        this.clockProvider.now(),
        response,
        userId,
      );

      const history = await this.lifecycleRepo.insertHistory(
        adSetId,
        'PAUSE',
        currentEffective,
        'PAUSED',
        userId,
        this.clockProvider.now(),
        response,
      );

      return AdSetLifecycleMapper.toHistoryDto(history);
    } catch (err: any) {
      throw new MetaOperationFailedException(err.message);
    }
  }

  async resumeAdSet(
    adSetId: string,
    workspaceId: string,
    userId: string,
  ): Promise<AdSetLifecycleHistoryDto> {
    const adset = await this.loadAndValidateAdSet(adSetId, workspaceId);

    const currentEffective = adset.statusDetail?.effectiveStatus || 'PAUSED';
    if (adset.status === CampaignStatus.ARCHIVED) {
      throw new AdSetArchivedException(adSetId);
    }
    if (currentEffective === 'ACTIVE') {
      throw new AdSetAlreadyActiveException(adSetId);
    }

    const accessToken = await this.getAccessToken(workspaceId);

    try {
      const response = await this.publisher.resumeAdSet(adset.externalAdSetId!, accessToken);

      await this.lifecycleRepo.updateAdSetStatus(
        adSetId,
        CampaignStatus.PUBLISHED,
        'ACTIVE',
        this.clockProvider.now(),
        response,
        userId,
      );

      const history = await this.lifecycleRepo.insertHistory(
        adSetId,
        'RESUME',
        currentEffective,
        'ACTIVE',
        userId,
        this.clockProvider.now(),
        response,
      );

      return AdSetLifecycleMapper.toHistoryDto(history);
    } catch (err: any) {
      throw new MetaOperationFailedException(err.message);
    }
  }

  async archiveAdSet(
    adSetId: string,
    workspaceId: string,
    userId: string,
  ): Promise<AdSetLifecycleHistoryDto> {
    const adset = await this.loadAndValidateAdSet(adSetId, workspaceId);

    const currentEffective = adset.statusDetail?.effectiveStatus || 'ACTIVE';
    if (adset.status === CampaignStatus.ARCHIVED) {
      throw new AdSetArchivedException(adSetId);
    }

    const accessToken = await this.getAccessToken(workspaceId);

    try {
      const response = await this.publisher.archiveAdSet(adset.externalAdSetId!, accessToken);

      await this.lifecycleRepo.updateAdSetStatus(
        adSetId,
        CampaignStatus.ARCHIVED,
        'ARCHIVED',
        this.clockProvider.now(),
        response,
        userId,
      );

      const history = await this.lifecycleRepo.insertHistory(
        adSetId,
        'ARCHIVE',
        currentEffective,
        'ARCHIVED',
        userId,
        this.clockProvider.now(),
        response,
      );

      return AdSetLifecycleMapper.toHistoryDto(history);
    } catch (err: any) {
      throw new MetaOperationFailedException(err.message);
    }
  }

  private async loadAndValidateAdSet(adSetId: string, workspaceId: string) {
    const adset = await this.lifecycleRepo.findById(adSetId);
    if (!adset || adset.campaign.workspaceId !== workspaceId) {
      throw new NotFoundException('Ad Set not found.');
    }

    if (!adset.campaign.isPublished || !adset.campaign.externalCampaignId) {
      throw new BadRequestException('Parent Campaign is not published.');
    }

    if (!adset.externalAdSetId) {
      throw new AdSetNotPublishedException(adSetId);
    }

    if (adset.status === CampaignStatus.ARCHIVED) {
      throw new AdSetArchivedException(adSetId);
    }

    return adset;
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
