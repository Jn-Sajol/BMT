import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { AdRepository } from '../../../infrastructure/database/repositories/ad.repository';
import { CampaignRepository } from '../../../infrastructure/database/repositories/campaign.repository';
import { AdValidationService } from './ad-validation.service';
import { AdHistoryService } from './ad-history.service';
import { CreateAdDto, UpdateAdDto, AdResponseDto } from '../common/ad.dto';
import { AdMapper } from '../common/ad.mapper';
import { Ad } from '@prisma/client';
import { IClockProvider } from '../../../common/ports/clock-provider.interface';
import { CLOCK_PROVIDER } from '../../../infrastructure/security/security.module';

@Injectable()
export class AdService {
  constructor(
    private readonly adRepo: AdRepository,
    private readonly campaignRepo: CampaignRepository,
    private readonly validationService: AdValidationService,
    private readonly historyService: AdHistoryService,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
  ) {}

  async create(dto: CreateAdDto, workspaceId: string, userId: string): Promise<AdResponseDto> {
    await this.validationService.validateCreate(dto, workspaceId);

    const now = this.clockProvider.now();
    const ad: Ad = {
      id: '',
      workspaceId,
      campaignId: dto.campaignId,
      adSetId: dto.adSetId,
      creativeId: dto.creativeId,
      name: dto.name,
      status: 'DRAFT',
      draftVersion: 1,
      externalAdId: null,
      publishedAt: null,
      publishedBy: null,
      publishResponse: null,
      trackingSpecs: dto.trackingSpecs || {},
      displayStatus: 'DRAFT',
      reviewStatus: 'PENDING_REVIEW',
      createdBy: userId,
      updatedBy: userId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    const saved = await this.adRepo.save(ad, dto.labels || [], dto.tags || []);
    await this.historyService.createSnapshot(saved, userId);

    return AdMapper.toResponse(saved);
  }

  async update(id: string, dto: UpdateAdDto, workspaceId: string, userId: string): Promise<AdResponseDto> {
    await this.validationService.validateUpdate(dto);

    const ad = await this.adRepo.findById(id);
    if (!ad || ad.workspaceId !== workspaceId) {
      throw new NotFoundException('Ad not found');
    }

    const now = this.clockProvider.now();
    const updated: Ad = {
      ...ad,
      name: dto.name !== undefined ? dto.name : ad.name,
      trackingSpecs: dto.trackingSpecs !== undefined ? dto.trackingSpecs : ad.trackingSpecs,
      status: dto.status !== undefined ? dto.status : ad.status,
      draftVersion: ad.draftVersion + 1,
      updatedBy: userId,
      updatedAt: now,
    };

    const currentLabels = (ad as any).labels ? (ad as any).labels.map((l: any) => l.name) : [];
    const currentTags = (ad as any).tags ? (ad as any).tags.map((t: any) => t.name) : [];

    const labels = dto.labels !== undefined ? dto.labels : currentLabels;
    const tags = dto.tags !== undefined ? dto.tags : currentTags;

    const saved = await this.adRepo.save(updated, labels, tags);
    await this.historyService.createSnapshot(saved, userId);

    return AdMapper.toResponse(saved);
  }

  async findOne(id: string, workspaceId: string): Promise<AdResponseDto> {
    const ad = await this.adRepo.findById(id);
    if (!ad || ad.workspaceId !== workspaceId) {
      throw new NotFoundException('Ad not found');
    }

    return AdMapper.toResponse(ad);
  }

  async findByCampaignId(campaignId: string, workspaceId: string): Promise<AdResponseDto[]> {
    const campaign = await this.campaignRepo.findById(campaignId);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new NotFoundException('Campaign not found');
    }

    const ads = await this.adRepo.findByCampaignId(campaignId);
    return ads.map(AdMapper.toResponse);
  }

  async findByAdSetId(adSetId: string, workspaceId: string): Promise<AdResponseDto[]> {
    const ads = await this.adRepo.findByAdSetId(adSetId);
    const filtered = ads.filter((a) => a.workspaceId === workspaceId);
    return filtered.map(AdMapper.toResponse);
  }

  async delete(id: string, workspaceId: string, userId: string): Promise<void> {
    const ad = await this.adRepo.findById(id);
    if (!ad || ad.workspaceId !== workspaceId) {
      throw new NotFoundException('Ad not found');
    }

    const now = this.clockProvider.now();
    const softDeleted: Ad = {
      ...ad,
      deletedAt: now,
      updatedBy: userId,
      updatedAt: now,
    };

    const currentLabels = (ad as any).labels ? (ad as any).labels.map((l: any) => l.name) : [];
    const currentTags = (ad as any).tags ? (ad as any).tags.map((t: any) => t.name) : [];

    await this.adRepo.save(softDeleted, currentLabels, currentTags);
  }

  async duplicate(id: string, workspaceId: string, userId: string): Promise<AdResponseDto> {
    const ad = await this.adRepo.findById(id);
    if (!ad || ad.workspaceId !== workspaceId) {
      throw new NotFoundException('Ad not found');
    }

    const now = this.clockProvider.now();
    const duplicated: Ad = {
      ...ad,
      id: '',
      name: `${ad.name} (Copy)`,
      status: 'DRAFT',
      draftVersion: 1,
      externalAdId: null,
      publishedAt: null,
      publishedBy: null,
      publishResponse: null,
      createdBy: userId,
      updatedBy: userId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    const currentLabels = (ad as any).labels ? (ad as any).labels.map((l: any) => l.name) : [];
    const currentTags = (ad as any).tags ? (ad as any).tags.map((t: any) => t.name) : [];

    const saved = await this.adRepo.save(duplicated, currentLabels, currentTags);
    await this.historyService.createSnapshot(saved, userId);

    return AdMapper.toResponse(saved);
  }

  async restore(id: string, version: number, workspaceId: string, userId: string): Promise<AdResponseDto> {
    const ad = await this.adRepo.findById(id);
    if (!ad || ad.workspaceId !== workspaceId) {
      throw new NotFoundException('Ad not found');
    }

    const snapshotRecord = await this.historyService.getSnapshot(id, version);
    if (!snapshotRecord) {
      throw new BadRequestException('Requested Ad version snapshot not found');
    }

    const snapshot = snapshotRecord.snapshot as any;
    const now = this.clockProvider.now();

    const restored: Ad = {
      ...ad,
      name: snapshot.name,
      trackingSpecs: snapshot.trackingSpecs,
      status: 'DRAFT',
      draftVersion: ad.draftVersion + 1,
      updatedBy: userId,
      updatedAt: now,
    };

    const labels = snapshot.labels ? snapshot.labels.map((l: any) => l.name) : [];
    const tags = snapshot.tags ? snapshot.tags.map((t: any) => t.name) : [];

    const saved = await this.adRepo.save(restored, labels, tags);
    await this.historyService.createSnapshot(saved, userId);

    return AdMapper.toResponse(saved);
  }
}
