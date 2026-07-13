import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { AdCreativeRepository } from '../../../infrastructure/database/repositories/ad-creative.repository';
import { CampaignRepository } from '../../../infrastructure/database/repositories/campaign.repository';
import { AdCreativeValidationService } from './adcreative-validation.service';
import { AdCreativeHistoryService } from './adcreative-history.service';
import { CreateAdCreativeDto, UpdateAdCreativeDto, AdCreativeResponseDto } from '../common/adcreative.dto';
import { AdCreativeMapper } from '../common/adcreative.mapper';
import { AdCreative } from '@prisma/client';
import { IClockProvider } from '../../../common/ports/clock-provider.interface';
import { CLOCK_PROVIDER } from '../../../infrastructure/security/security.module';

@Injectable()
export class AdCreativeService {
  constructor(
    private readonly adCreativeRepo: AdCreativeRepository,
    private readonly campaignRepo: CampaignRepository,
    private readonly validationService: AdCreativeValidationService,
    private readonly historyService: AdCreativeHistoryService,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
  ) {}

  async create(dto: CreateAdCreativeDto, workspaceId: string, userId: string): Promise<AdCreativeResponseDto> {
    await this.validationService.validateCreate(dto, workspaceId);

    const now = this.clockProvider.now();
    const adCreative: AdCreative = {
      id: '',
      campaignId: dto.campaignId,
      creativeType: dto.creativeType,
      name: dto.name,
      primaryText: dto.primaryText,
      headline: dto.headline,
      description: dto.description || null,
      callToAction: dto.callToAction,
      destinationUrl: dto.destinationUrl,
      displayLink: dto.displayLink || null,
      caption: dto.caption || null,
      linkDescription: dto.linkDescription || null,
      facebookPageId: dto.facebookPageId || null,
      instagramAccountId: dto.instagramAccountId || null,
      mediaType: dto.mediaType || null,
      mediaAssetId: dto.mediaAssetId || null,
      thumbnailAssetId: dto.thumbnailAssetId || null,
      pixelId: dto.pixelId || null,
      trackingParameters: dto.trackingParameters || {},
      creativeSpec: dto.creativeSpec || {},
      status: 'DRAFT',
      draftVersion: 1,
      externalCreativeId: null,
      publishedAt: null,
      publishedBy: null,
      publishResponse: null,
      createdBy: userId,
      updatedBy: userId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    const saved = await this.adCreativeRepo.save(adCreative, dto.labels || [], dto.tags || []);
    await this.historyService.createSnapshot(saved, userId);

    return AdCreativeMapper.toResponse(saved);
  }

  async update(id: string, dto: UpdateAdCreativeDto, workspaceId: string, userId: string): Promise<AdCreativeResponseDto> {
    await this.validationService.validateUpdate(dto, workspaceId);

    const adCreative = await this.adCreativeRepo.findById(id);
    if (!adCreative) {
      throw new NotFoundException('Ad Creative not found');
    }

    const campaign = await this.campaignRepo.findById(adCreative.campaignId);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new NotFoundException('Ad Creative not found');
    }

    const now = this.clockProvider.now();
    const updated: AdCreative = {
      ...adCreative,
      creativeType: dto.creativeType !== undefined ? dto.creativeType : adCreative.creativeType,
      name: dto.name !== undefined ? dto.name : adCreative.name,
      primaryText: dto.primaryText !== undefined ? dto.primaryText : adCreative.primaryText,
      headline: dto.headline !== undefined ? dto.headline : adCreative.headline,
      description: dto.description !== undefined ? dto.description : adCreative.description,
      callToAction: dto.callToAction !== undefined ? dto.callToAction : adCreative.callToAction,
      destinationUrl: dto.destinationUrl !== undefined ? dto.destinationUrl : adCreative.destinationUrl,
      displayLink: dto.displayLink !== undefined ? dto.displayLink : adCreative.displayLink,
      caption: dto.caption !== undefined ? dto.caption : adCreative.caption,
      linkDescription: dto.linkDescription !== undefined ? dto.linkDescription : adCreative.linkDescription,
      facebookPageId: dto.facebookPageId !== undefined ? dto.facebookPageId : adCreative.facebookPageId,
      instagramAccountId: dto.instagramAccountId !== undefined ? dto.instagramAccountId : adCreative.instagramAccountId,
      mediaType: dto.mediaType !== undefined ? dto.mediaType : adCreative.mediaType,
      mediaAssetId: dto.mediaAssetId !== undefined ? dto.mediaAssetId : adCreative.mediaAssetId,
      thumbnailAssetId: dto.thumbnailAssetId !== undefined ? dto.thumbnailAssetId : adCreative.thumbnailAssetId,
      pixelId: dto.pixelId !== undefined ? dto.pixelId : adCreative.pixelId,
      trackingParameters: dto.trackingParameters !== undefined ? dto.trackingParameters : adCreative.trackingParameters,
      creativeSpec: dto.creativeSpec !== undefined ? dto.creativeSpec : adCreative.creativeSpec,
      status: dto.status !== undefined ? dto.status : adCreative.status,
      draftVersion: adCreative.draftVersion + 1,
      updatedBy: userId,
      updatedAt: now,
    };

    const currentLabels = (adCreative as any).labels ? (adCreative as any).labels.map((l: any) => l.name) : [];
    const currentTags = (adCreative as any).tags ? (adCreative as any).tags.map((t: any) => t.name) : [];

    const labels = dto.labels !== undefined ? dto.labels : currentLabels;
    const tags = dto.tags !== undefined ? dto.tags : currentTags;

    const saved = await this.adCreativeRepo.save(updated, labels, tags);
    await this.historyService.createSnapshot(saved, userId);

    return AdCreativeMapper.toResponse(saved);
  }

  async findOne(id: string, workspaceId: string): Promise<AdCreativeResponseDto> {
    const adCreative = await this.adCreativeRepo.findById(id);
    if (!adCreative) {
      throw new NotFoundException('Ad Creative not found');
    }

    const campaign = await this.campaignRepo.findById(adCreative.campaignId);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new NotFoundException('Ad Creative not found');
    }

    return AdCreativeMapper.toResponse(adCreative);
  }

  async findByCampaignId(campaignId: string, workspaceId: string): Promise<AdCreativeResponseDto[]> {
    const campaign = await this.campaignRepo.findById(campaignId);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new NotFoundException('Campaign not found');
    }

    const creatives = await this.adCreativeRepo.findByCampaignId(campaignId);
    return creatives.map(AdCreativeMapper.toResponse);
  }

  async delete(id: string, workspaceId: string, userId: string): Promise<void> {
    const adCreative = await this.adCreativeRepo.findById(id);
    if (!adCreative) {
      throw new NotFoundException('Ad Creative not found');
    }

    const campaign = await this.campaignRepo.findById(adCreative.campaignId);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new NotFoundException('Ad Creative not found');
    }

    const now = this.clockProvider.now();
    const softDeleted: AdCreative = {
      ...adCreative,
      deletedAt: now,
      updatedBy: userId,
      updatedAt: now,
    };

    const currentLabels = (adCreative as any).labels ? (adCreative as any).labels.map((l: any) => l.name) : [];
    const currentTags = (adCreative as any).tags ? (adCreative as any).tags.map((t: any) => t.name) : [];

    await this.adCreativeRepo.save(softDeleted, currentLabels, currentTags);
  }

  async restore(id: string, version: number, workspaceId: string, userId: string): Promise<AdCreativeResponseDto> {
    const adCreative = await this.adCreativeRepo.findById(id);
    if (!adCreative) {
      throw new NotFoundException('Ad Creative not found');
    }

    const campaign = await this.campaignRepo.findById(adCreative.campaignId);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new NotFoundException('Ad Creative not found');
    }

    const snapshotRecord = await this.historyService.getSnapshot(id, version);
    if (!snapshotRecord) {
      throw new BadRequestException('Requested Ad Creative version snapshot not found');
    }

    const snapshot = snapshotRecord.snapshot as any;
    const now = this.clockProvider.now();

    const restored: AdCreative = {
      ...adCreative,
      creativeType: snapshot.creativeType,
      name: snapshot.name,
      primaryText: snapshot.primaryText,
      headline: snapshot.headline,
      description: snapshot.description,
      callToAction: snapshot.callToAction,
      destinationUrl: snapshot.destinationUrl,
      displayLink: snapshot.displayLink,
      caption: snapshot.caption,
      linkDescription: snapshot.linkDescription,
      facebookPageId: snapshot.facebookPageId,
      instagramAccountId: snapshot.instagramAccountId,
      mediaType: snapshot.mediaType,
      mediaAssetId: snapshot.mediaAssetId,
      thumbnailAssetId: snapshot.thumbnailAssetId,
      pixelId: snapshot.pixelId,
      trackingParameters: snapshot.trackingParameters,
      creativeSpec: snapshot.creativeSpec,
      status: 'DRAFT',
      draftVersion: adCreative.draftVersion + 1,
      updatedBy: userId,
      updatedAt: now,
    };

    const labels = snapshot.labels ? snapshot.labels.map((l: any) => l.name) : [];
    const tags = snapshot.tags ? snapshot.tags.map((t: any) => t.name) : [];

    const saved = await this.adCreativeRepo.save(restored, labels, tags);
    await this.historyService.createSnapshot(saved, userId);

    return AdCreativeMapper.toResponse(saved);
  }
}
