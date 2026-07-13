import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateAdCreativeDto, UpdateAdCreativeDto } from '../common/adcreative.dto';
import { CampaignRepository } from '../../../infrastructure/database/repositories/campaign.repository';
import { MetaPageRepository } from '../../../infrastructure/database/repositories/meta-page.repository';
import { MetaInstagramAccountRepository } from '../../../infrastructure/database/repositories/meta-instagram.repository';
import { MetaPixelRepository } from '../../../infrastructure/database/repositories/meta-pixel.repository';

@Injectable()
export class AdCreativeValidationService {
  constructor(
    private readonly campaignRepo: CampaignRepository,
    private readonly pageRepo: MetaPageRepository,
    private readonly instagramRepo: MetaInstagramAccountRepository,
    private readonly pixelRepo: MetaPixelRepository,
  ) {}

  async validateCreate(dto: CreateAdCreativeDto, workspaceId: string): Promise<void> {
    if (!dto.campaignId) {
      throw new BadRequestException('Campaign ID is required');
    }

    const campaign = await this.campaignRepo.findById(dto.campaignId);
    if (!campaign || campaign.workspaceId !== workspaceId) {
      throw new BadRequestException('Associated Campaign does not exist in current workspace context');
    }

    if (!dto.name || dto.name.trim().length === 0) {
      throw new BadRequestException('Ad Creative name is required');
    }

    if (!dto.creativeType) {
      throw new BadRequestException('Creative type is required');
    }

    const validTypes = ['IMAGE', 'VIDEO', 'CAROUSEL', 'COLLECTION', 'EXISTING_POST'];
    if (!validTypes.includes(dto.creativeType)) {
      throw new BadRequestException(`Invalid creative type. Supported: ${validTypes.join(', ')}`);
    }

    if (!dto.primaryText || dto.primaryText.trim().length === 0) {
      throw new BadRequestException('Primary text is required');
    }

    if (!dto.headline || dto.headline.trim().length === 0) {
      throw new BadRequestException('Headline is required');
    }

    if (!dto.callToAction || dto.callToAction.trim().length === 0) {
      throw new BadRequestException('Call to Action (CTA) is required');
    }

    if (!dto.destinationUrl || dto.destinationUrl.trim().length === 0) {
      throw new BadRequestException('Destination URL is required');
    }

    try {
      new URL(dto.destinationUrl);
    } catch {
      throw new BadRequestException('Destination URL must be a valid absolute HTTP/HTTPS URL');
    }

    if (dto.creativeType === 'IMAGE' && !dto.mediaAssetId) {
      throw new BadRequestException('Media asset ID (image) is required for IMAGE creative type');
    }

    if (dto.creativeType === 'VIDEO' && !dto.mediaAssetId) {
      throw new BadRequestException('Media asset ID (video) is required for VIDEO creative type');
    }

    if (dto.creativeType === 'CAROUSEL') {
      const spec = dto.creativeSpec;
      if (!spec || !Array.isArray(spec.cards) || spec.cards.length < 2 || spec.cards.length > 10) {
        throw new BadRequestException('CAROUSEL creative type requires a creativeSpec containing between 2 and 10 cards');
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

    if (dto.pixelId) {
      const pixels = await this.pixelRepo.findByWorkspaceId(workspaceId);
      const hasPixel = pixels.some((p) => p.id === dto.pixelId);
      if (!hasPixel) {
        throw new BadRequestException('Meta Pixel does not exist in current workspace context');
      }
    }
  }

  async validateUpdate(dto: UpdateAdCreativeDto, workspaceId: string): Promise<void> {
    if (dto.name !== undefined && dto.name.trim().length === 0) {
      throw new BadRequestException('Ad Creative name cannot be empty');
    }

    if (dto.creativeType !== undefined) {
      const validTypes = ['IMAGE', 'VIDEO', 'CAROUSEL', 'COLLECTION', 'EXISTING_POST'];
      if (!validTypes.includes(dto.creativeType)) {
        throw new BadRequestException(`Invalid creative type. Supported: ${validTypes.join(', ')}`);
      }
    }

    if (dto.destinationUrl !== undefined) {
      try {
        new URL(dto.destinationUrl);
      } catch {
        throw new BadRequestException('Destination URL must be a valid absolute HTTP/HTTPS URL');
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

    if (dto.pixelId) {
      const pixels = await this.pixelRepo.findByWorkspaceId(workspaceId);
      const hasPixel = pixels.some((p) => p.id === dto.pixelId);
      if (!hasPixel) {
        throw new BadRequestException('Meta Pixel does not exist in current workspace context');
      }
    }
  }
}
