import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { AdSetRepository } from '../../../infrastructure/database/repositories/ad-set.repository';
import { CampaignRepository } from '../../../infrastructure/database/repositories/campaign.repository';
import { AdSetValidationService } from './adset-validation.service';
import { AdSetHistoryService } from './adset-history.service';
import { CreateAdSetDto, UpdateAdSetDto, AdSetResponseDto } from '../common/adset.dto';
import { AdSetMapper } from '../common/adset.mapper';
import { AdSet } from '@prisma/client';
import { IClockProvider } from '../../../common/ports/clock-provider.interface';
import { CLOCK_PROVIDER } from '../../../infrastructure/security/security.module';

@Injectable()
export class AdSetService {
  constructor(
    private readonly adSetRepo: AdSetRepository,
    private readonly campaignRepo: CampaignRepository,
    private readonly validationService: AdSetValidationService,
    private readonly historyService: AdSetHistoryService,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
  ) {}

  async create(dto: CreateAdSetDto, workspaceId: string, userId: string): Promise<AdSetResponseDto> {
    await this.validationService.validateCreate(dto, workspaceId);

    const now = this.clockProvider.now();
    const adSet: AdSet = {
      id: '',
      campaignId: dto.campaignId,
      name: dto.name,
      status: 'DRAFT',
      optimizationGoal: dto.optimizationGoal,
      billingEvent: dto.billingEvent,
      bidStrategy: dto.bidStrategy || null,
      dailyBudget: dto.dailyBudget || null,
      lifetimeBudget: dto.lifetimeBudget || null,
      startTime: new Date(dto.startTime),
      endTime: dto.endTime ? new Date(dto.endTime) : null,
      attributionSetting: dto.attributionSetting || null,
      targeting: dto.targeting as any,
      promotedObject: dto.promotedObject || null,
      metaPixelId: dto.metaPixelId || null,
      instagramAccountId: dto.instagramAccountId || null,
      facebookPageId: dto.facebookPageId || null,
      draftVersion: 1,
      createdBy: userId,
      updatedBy: userId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      publishedAt: null,
      publishedBy: null,
      externalAdSetId: null,
      publishResponse: null,
    };

    const saved = await this.adSetRepo.save(adSet, dto.labels || [], dto.tags || []);
    await this.historyService.createSnapshot(saved, userId);

    return AdSetMapper.toResponse(saved);
  }

  async update(id: string, dto: UpdateAdSetDto, workspaceId: string, userId: string): Promise<AdSetResponseDto> {
    await this.validationService.validateUpdate(dto, workspaceId);

    const adSet = await this.adSetRepo.findById(id);
    if (!adSet) {
      throw new NotFoundException('Ad Set not found');
    }

    const campaign = await this.campaignRepo.findById(adSet.campaignId);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new NotFoundException('Ad Set not found');
    }

    const now = this.clockProvider.now();
    const updated: AdSet = {
      ...adSet,
      name: dto.name !== undefined ? dto.name : adSet.name,
      status: dto.status !== undefined ? dto.status : adSet.status,
      optimizationGoal: dto.optimizationGoal !== undefined ? dto.optimizationGoal : adSet.optimizationGoal,
      billingEvent: dto.billingEvent !== undefined ? dto.billingEvent : adSet.billingEvent,
      bidStrategy: dto.bidStrategy !== undefined ? dto.bidStrategy : adSet.bidStrategy,
      dailyBudget: dto.dailyBudget !== undefined ? dto.dailyBudget : adSet.dailyBudget,
      lifetimeBudget: dto.lifetimeBudget !== undefined ? dto.lifetimeBudget : adSet.lifetimeBudget,
      startTime: dto.startTime !== undefined ? new Date(dto.startTime) : adSet.startTime,
      endTime: dto.endTime !== undefined ? (dto.endTime ? new Date(dto.endTime) : null) : adSet.endTime,
      attributionSetting: dto.attributionSetting !== undefined ? dto.attributionSetting : adSet.attributionSetting,
      targeting: dto.targeting !== undefined ? dto.targeting : adSet.targeting,
      promotedObject: dto.promotedObject !== undefined ? dto.promotedObject : adSet.promotedObject,
      metaPixelId: dto.metaPixelId !== undefined ? dto.metaPixelId : adSet.metaPixelId,
      instagramAccountId: dto.instagramAccountId !== undefined ? dto.instagramAccountId : adSet.instagramAccountId,
      facebookPageId: dto.facebookPageId !== undefined ? dto.facebookPageId : adSet.facebookPageId,
      draftVersion: adSet.draftVersion + 1,
      updatedBy: userId,
      updatedAt: now,
    };

    const currentLabels = (adSet as any).labels ? (adSet as any).labels.map((l: any) => l.name) : [];
    const currentTags = (adSet as any).tags ? (adSet as any).tags.map((t: any) => t.name) : [];

    const labels = dto.labels !== undefined ? dto.labels : currentLabels;
    const tags = dto.tags !== undefined ? dto.tags : currentTags;

    const saved = await this.adSetRepo.save(updated, labels, tags);
    await this.historyService.createSnapshot(saved, userId);

    return AdSetMapper.toResponse(saved);
  }

  async findOne(id: string, workspaceId: string): Promise<AdSetResponseDto> {
    const adSet = await this.adSetRepo.findById(id);
    if (!adSet) {
      throw new NotFoundException('Ad Set not found');
    }

    const campaign = await this.campaignRepo.findById(adSet.campaignId);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new NotFoundException('Ad Set not found');
    }

    return AdSetMapper.toResponse(adSet);
  }

  async findByCampaignId(campaignId: string, workspaceId: string): Promise<AdSetResponseDto[]> {
    const campaign = await this.campaignRepo.findById(campaignId);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new NotFoundException('Campaign not found');
    }

    const adSets = await this.adSetRepo.findByCampaignId(campaignId);
    return adSets.map(AdSetMapper.toResponse);
  }

  async delete(id: string, workspaceId: string, userId: string): Promise<void> {
    const adSet = await this.adSetRepo.findById(id);
    if (!adSet) {
      throw new NotFoundException('Ad Set not found');
    }

    const campaign = await this.campaignRepo.findById(adSet.campaignId);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new NotFoundException('Ad Set not found');
    }

    const now = this.clockProvider.now();
    const softDeleted: AdSet = {
      ...adSet,
      deletedAt: now,
      updatedBy: userId,
      updatedAt: now,
    };

    const currentLabels = (adSet as any).labels ? (adSet as any).labels.map((l: any) => l.name) : [];
    const currentTags = (adSet as any).tags ? (adSet as any).tags.map((t: any) => t.name) : [];

    await this.adSetRepo.save(softDeleted, currentLabels, currentTags);
  }

  async restore(id: string, version: number, workspaceId: string, userId: string): Promise<AdSetResponseDto> {
    const adSet = await this.adSetRepo.findById(id);
    if (!adSet) {
      throw new NotFoundException('Ad Set not found');
    }

    const campaign = await this.campaignRepo.findById(adSet.campaignId);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new NotFoundException('Ad Set not found');
    }

    const snapshotRecord = await this.historyService.getSnapshot(id, version);
    if (!snapshotRecord) {
      throw new BadRequestException('Requested Ad Set version snapshot not found');
    }

    const snapshot = snapshotRecord.snapshot as any;
    const now = this.clockProvider.now();

    const restored: AdSet = {
      ...adSet,
      name: snapshot.name,
      status: 'DRAFT',
      optimizationGoal: snapshot.optimizationGoal,
      billingEvent: snapshot.billingEvent,
      bidStrategy: snapshot.bidStrategy,
      dailyBudget: snapshot.dailyBudget,
      lifetimeBudget: snapshot.lifetimeBudget,
      startTime: new Date(snapshot.startTime),
      endTime: snapshot.endTime ? new Date(snapshot.endTime) : null,
      attributionSetting: snapshot.attributionSetting,
      targeting: snapshot.targeting,
      promotedObject: snapshot.promotedObject,
      metaPixelId: snapshot.metaPixelId,
      instagramAccountId: snapshot.instagramAccountId,
      facebookPageId: snapshot.facebookPageId,
      draftVersion: adSet.draftVersion + 1,
      updatedBy: userId,
      updatedAt: now,
    };

    const labels = snapshot.labels ? snapshot.labels.map((l: any) => l.name) : [];
    const tags = snapshot.tags ? snapshot.tags.map((t: any) => t.name) : [];

    const saved = await this.adSetRepo.save(restored, labels, tags);
    await this.historyService.createSnapshot(saved, userId);

    return AdSetMapper.toResponse(saved);
  }
}
