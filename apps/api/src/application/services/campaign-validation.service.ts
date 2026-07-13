import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCampaignDto, UpdateCampaignDto } from '../../common/dto/campaign.dto';
import { MetaBusinessRepository } from '../../infrastructure/database/repositories/meta-business.repository';
import { MetaAdAccountRepository } from '../../infrastructure/database/repositories/meta-ad-account.repository';

@Injectable()
export class CampaignValidationService {
  constructor(
    private readonly businessRepo: MetaBusinessRepository,
    private readonly adAccountRepo: MetaAdAccountRepository,
  ) {}

  async validateCreate(dto: CreateCampaignDto, workspaceId: string): Promise<void> {
    if (!dto.name || dto.name.trim().length === 0) {
      throw new BadRequestException('Campaign name is required');
    }

    if (!dto.objective) {
      throw new BadRequestException('Campaign objective is required');
    }

    if (!dto.metaBusinessId) {
      throw new BadRequestException('Business context is required');
    }

    if (!dto.metaAdAccountId) {
      throw new BadRequestException('Ad Account context is required');
    }

    const businesses = await this.businessRepo.findByWorkspaceId(workspaceId);
    const hasBusiness = businesses.some((b) => b.id === dto.metaBusinessId);
    if (!hasBusiness) {
      throw new BadRequestException('Meta Business does not exist in current workspace context');
    }

    const adAccounts = await this.adAccountRepo.findByWorkspaceId(workspaceId);
    const hasAdAccount = adAccounts.some((a) => a.id === dto.metaAdAccountId);
    if (!hasAdAccount) {
      throw new BadRequestException('Meta Ad Account does not exist in current workspace context');
    }
  }

  async validateUpdate(dto: UpdateCampaignDto): Promise<void> {
    if (dto.name !== undefined && dto.name.trim().length === 0) {
      throw new BadRequestException('Campaign name cannot be empty');
    }
  }
}
