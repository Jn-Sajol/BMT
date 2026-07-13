import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateAdDto, UpdateAdDto } from '../common/ad.dto';
import { CampaignRepository } from '../../../infrastructure/database/repositories/campaign.repository';
import { AdSetRepository } from '../../../infrastructure/database/repositories/ad-set.repository';
import { AdCreativeRepository } from '../../../infrastructure/database/repositories/ad-creative.repository';

@Injectable()
export class AdValidationService {
  constructor(
    private readonly campaignRepo: CampaignRepository,
    private readonly adSetRepo: AdSetRepository,
    private readonly creativeRepo: AdCreativeRepository,
  ) {}

  async validateCreate(dto: CreateAdDto, workspaceId: string): Promise<void> {
    if (!dto.campaignId) {
      throw new BadRequestException('Campaign ID is required');
    }
    if (!dto.adSetId) {
      throw new BadRequestException('Ad Set ID is required');
    }
    if (!dto.creativeId) {
      throw new BadRequestException('Creative ID is required');
    }
    if (!dto.name || dto.name.trim().length === 0) {
      throw new BadRequestException('Ad name is required');
    }

    const campaign = await this.campaignRepo.findById(dto.campaignId);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new BadRequestException('Parent Campaign does not exist in current workspace context');
    }

    const adSet = await this.adSetRepo.findById(dto.adSetId);
    if (!adSet || adSet.campaignId !== campaign.id) {
      throw new BadRequestException('Parent Ad Set does not exist or does not belong to the selected Campaign');
    }

    const creative = await this.creativeRepo.findById(dto.creativeId);
    if (!creative || creative.campaignId !== campaign.id) {
      throw new BadRequestException('Ad Creative does not exist or does not belong to the selected Campaign');
    }
  }

  async validateUpdate(dto: UpdateAdDto): Promise<void> {
    if (dto.name !== undefined && dto.name.trim().length === 0) {
      throw new BadRequestException('Ad name cannot be empty');
    }
  }
}
