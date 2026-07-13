import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateAdSetDto, UpdateAdSetDto } from '../common/adset.dto';
import { CampaignRepository } from '../../../infrastructure/database/repositories/campaign.repository';
import { MetaPixelRepository } from '../../../infrastructure/database/repositories/meta-pixel.repository';
import { MetaPageRepository } from '../../../infrastructure/database/repositories/meta-page.repository';
import { MetaInstagramAccountRepository } from '../../../infrastructure/database/repositories/meta-instagram.repository';

@Injectable()
export class AdSetValidationService {
  constructor(
    private readonly campaignRepo: CampaignRepository,
    private readonly pixelRepo: MetaPixelRepository,
    private readonly pageRepo: MetaPageRepository,
    private readonly instagramRepo: MetaInstagramAccountRepository,
  ) {}

  async validateCreate(dto: CreateAdSetDto, workspaceId: string): Promise<void> {
    if (!dto.campaignId) {
      throw new BadRequestException('Campaign ID is required');
    }

    const campaign = await this.campaignRepo.findById(dto.campaignId);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new BadRequestException('Associated Campaign does not exist in current workspace context');
    }

    if (!dto.name || dto.name.trim().length === 0) {
      throw new BadRequestException('Ad Set name is required');
    }

    if (!dto.optimizationGoal) {
      throw new BadRequestException('Optimization goal is required');
    }

    if (!dto.billingEvent) {
      throw new BadRequestException('Billing event is required');
    }

    if (!dto.targeting || Object.keys(dto.targeting).length === 0) {
      throw new BadRequestException('Targeting criteria is required');
    }

    if (dto.dailyBudget !== undefined && dto.dailyBudget <= 0) {
      throw new BadRequestException('Daily budget must be greater than zero');
    }
    if (dto.lifetimeBudget !== undefined && dto.lifetimeBudget <= 0) {
      throw new BadRequestException('Lifetime budget must be greater than zero');
    }

    const startTime = new Date(dto.startTime);
    if (isNaN(startTime.getTime())) {
      throw new BadRequestException('Start time must be a valid date');
    }
    if (dto.endTime) {
      const endTime = new Date(dto.endTime);
      if (isNaN(endTime.getTime())) {
        throw new BadRequestException('End time must be a valid date');
      }
      if (endTime <= startTime) {
        throw new BadRequestException('End time must be strictly after start time');
      }
    }

    if (dto.metaPixelId) {
      const pixels = await this.pixelRepo.findByWorkspaceId(workspaceId);
      const hasPixel = pixels.some((p) => p.id === dto.metaPixelId);
      if (!hasPixel) {
        throw new BadRequestException('Meta Pixel does not exist in current workspace context');
      }
    }

    if (dto.facebookPageId) {
      const pages = await this.pageRepo.findByWorkspaceId(workspaceId);
      const hasPage = pages.some((p) => p.id === dto.facebookPageId);
      if (!hasPage) {
        throw new BadRequestException('Facebook Page does not exist in current workspace context');
      }
    }

    if (dto.instagramAccountId) {
      const instagrams = await this.instagramRepo.findByWorkspaceId(workspaceId);
      const hasInsta = instagrams.some((i) => i.id === dto.instagramAccountId);
      if (!hasInsta) {
        throw new BadRequestException('Instagram Account does not exist in current workspace context');
      }
    }
  }

  async validateUpdate(dto: UpdateAdSetDto, workspaceId: string): Promise<void> {
    if (dto.name !== undefined && dto.name.trim().length === 0) {
      throw new BadRequestException('Ad Set name cannot be empty');
    }

    if (dto.targeting !== undefined && (!dto.targeting || Object.keys(dto.targeting).length === 0)) {
      throw new BadRequestException('Targeting criteria cannot be empty');
    }

    if (dto.dailyBudget !== undefined && dto.dailyBudget <= 0) {
      throw new BadRequestException('Daily budget must be greater than zero');
    }
    if (dto.lifetimeBudget !== undefined && dto.lifetimeBudget <= 0) {
      throw new BadRequestException('Lifetime budget must be greater than zero');
    }

    if (dto.metaPixelId) {
      const pixels = await this.pixelRepo.findByWorkspaceId(workspaceId);
      const hasPixel = pixels.some((p) => p.id === dto.metaPixelId);
      if (!hasPixel) {
        throw new BadRequestException('Meta Pixel does not exist in current workspace context');
      }
    }

    if (dto.facebookPageId) {
      const pages = await this.pageRepo.findByWorkspaceId(workspaceId);
      const hasPage = pages.some((p) => p.id === dto.facebookPageId);
      if (!hasPage) {
        throw new BadRequestException('Facebook Page does not exist in current workspace context');
      }
    }

    if (dto.instagramAccountId) {
      const instagrams = await this.instagramRepo.findByWorkspaceId(workspaceId);
      const hasInsta = instagrams.some((i) => i.id === dto.instagramAccountId);
      if (!hasInsta) {
        throw new BadRequestException('Instagram Account does not exist in current workspace context');
      }
    }
  }
}
