import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { CampaignRepository } from '../../infrastructure/database/repositories/campaign.repository';
import { CampaignValidationService } from './campaign-validation.service';
import { CampaignHistoryService } from './campaign-history.service';
import { CreateCampaignDto, UpdateCampaignDto, CampaignResponseDto } from '../../common/dto/campaign.dto';
import { CampaignMapper } from '../../common/mappers/campaign.mapper';
import { Campaign } from '@prisma/client';
import { IClockProvider } from '../../common/ports/clock-provider.interface';
import { CLOCK_PROVIDER } from '../../infrastructure/security/security.module';

@Injectable()
export class CampaignService {
  constructor(
    private readonly campaignRepo: CampaignRepository,
    private readonly validationService: CampaignValidationService,
    private readonly historyService: CampaignHistoryService,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
  ) {}

  async create(dto: CreateCampaignDto, workspaceId: string, organizationId: string, userId: string): Promise<CampaignResponseDto> {
    await this.validationService.validateCreate(dto, workspaceId);

    const now = this.clockProvider.now();
    const campaign: Campaign = {
      id: '',
      workspaceId,
      organizationId,
      metaBusinessId: dto.metaBusinessId,
      metaAdAccountId: dto.metaAdAccountId,
      name: dto.name,
      objective: dto.objective,
      buyingType: dto.buyingType || 'AUCTION',
      specialAdCategory: dto.specialAdCategory || 'NONE',
      status: 'DRAFT',
      draftVersion: 1,
      publishedVersion: 0,
      isPublished: false,
      createdBy: userId,
      updatedBy: userId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      externalCampaignId: null,
      publishedAt: null,
      publishedBy: null,
      publishResponse: null,
    };

    const saved = await this.campaignRepo.save(campaign, dto.labels || [], dto.tags || []);
    await this.historyService.createSnapshot(saved, userId);

    return CampaignMapper.toResponse(saved);
  }

  async update(id: string, dto: UpdateCampaignDto, workspaceId: string, userId: string): Promise<CampaignResponseDto> {
    await this.validationService.validateUpdate(dto);

    const campaign = await this.campaignRepo.findById(id);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new NotFoundException('Campaign not found');
    }

    const now = this.clockProvider.now();
    const updatedCampaign: Campaign = {
      ...campaign,
      name: dto.name !== undefined ? dto.name : campaign.name,
      objective: dto.objective !== undefined ? dto.objective : campaign.objective,
      buyingType: dto.buyingType !== undefined ? dto.buyingType : campaign.buyingType,
      specialAdCategory: dto.specialAdCategory !== undefined ? dto.specialAdCategory : campaign.specialAdCategory,
      status: dto.status !== undefined ? dto.status : campaign.status,
      draftVersion: campaign.draftVersion + 1,
      updatedBy: userId,
      updatedAt: now,
    };

    const currentLabels = (campaign as any).labels ? (campaign as any).labels.map((l: any) => l.name) : [];
    const currentTags = (campaign as any).tags ? (campaign as any).tags.map((t: any) => t.name) : [];

    const labels = dto.labels !== undefined ? dto.labels : currentLabels;
    const tags = dto.tags !== undefined ? dto.tags : currentTags;

    const saved = await this.campaignRepo.save(updatedCampaign, labels, tags);
    await this.historyService.createSnapshot(saved, userId);

    return CampaignMapper.toResponse(saved);
  }

  async findOne(id: string, workspaceId: string): Promise<CampaignResponseDto> {
    const campaign = await this.campaignRepo.findById(id);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new NotFoundException('Campaign not found');
    }
    return CampaignMapper.toResponse(campaign);
  }

  async findAll(workspaceId: string): Promise<CampaignResponseDto[]> {
    const campaigns = await this.campaignRepo.findByWorkspaceId(workspaceId);
    return campaigns.map(CampaignMapper.toResponse);
  }

  async delete(id: string, workspaceId: string, userId: string): Promise<void> {
    const campaign = await this.campaignRepo.findById(id);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new NotFoundException('Campaign not found');
    }

    const now = this.clockProvider.now();
    const softDeleted: Campaign = {
      ...campaign,
      deletedAt: now,
      updatedBy: userId,
      updatedAt: now,
    };

    const currentLabels = (campaign as any).labels ? (campaign as any).labels.map((l: any) => l.name) : [];
    const currentTags = (campaign as any).tags ? (campaign as any).tags.map((t: any) => t.name) : [];

    await this.campaignRepo.save(softDeleted, currentLabels, currentTags);
  }

  async duplicate(id: string, workspaceId: string, userId: string): Promise<CampaignResponseDto> {
    const campaign = await this.campaignRepo.findById(id);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new NotFoundException('Campaign not found');
    }

    const now = this.clockProvider.now();
    const duplicated: Campaign = {
      id: '',
      workspaceId,
      organizationId: campaign.organizationId,
      metaBusinessId: campaign.metaBusinessId,
      metaAdAccountId: campaign.metaAdAccountId,
      name: `${campaign.name} (Copy)`,
      objective: campaign.objective,
      buyingType: campaign.buyingType,
      specialAdCategory: campaign.specialAdCategory,
      status: 'DRAFT',
      draftVersion: 1,
      publishedVersion: 0,
      isPublished: false,
      createdBy: userId,
      updatedBy: userId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      externalCampaignId: null,
      publishedAt: null,
      publishedBy: null,
      publishResponse: null,
    };

    const currentLabels = (campaign as any).labels ? (campaign as any).labels.map((l: any) => l.name) : [];
    const currentTags = (campaign as any).tags ? (campaign as any).tags.map((t: any) => t.name) : [];

    const saved = await this.campaignRepo.save(duplicated, currentLabels, currentTags);
    await this.historyService.createSnapshot(saved, userId);

    return CampaignMapper.toResponse(saved);
  }

  async restore(id: string, version: number, workspaceId: string, userId: string): Promise<CampaignResponseDto> {
    const campaign = await this.campaignRepo.findById(id);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new NotFoundException('Campaign not found');
    }

    const snapshotRecord = await this.historyService.getSnapshot(id, version);
    if (!snapshotRecord) {
      throw new BadRequestException('Requested campaign version snapshot not found');
    }

    const snapshot = snapshotRecord.snapshot as any;
    const now = this.clockProvider.now();

    const restored: Campaign = {
      ...campaign,
      name: snapshot.name,
      objective: snapshot.objective,
      buyingType: snapshot.buyingType,
      specialAdCategory: snapshot.specialAdCategory,
      status: 'DRAFT',
      draftVersion: campaign.draftVersion + 1,
      updatedBy: userId,
      updatedAt: now,
    };

    const labels = snapshot.labels ? snapshot.labels.map((l: any) => l.name) : [];
    const tags = snapshot.tags ? snapshot.tags.map((t: any) => t.name) : [];

    const saved = await this.campaignRepo.save(restored, labels, tags);
    await this.historyService.createSnapshot(saved, userId);

    return CampaignMapper.toResponse(saved);
  }
}
