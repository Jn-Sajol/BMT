import { CampaignObjective, CampaignStatus } from '@prisma/client';

export class CreateCampaignDto {
  name!: string;
  objective!: CampaignObjective;
  metaBusinessId!: string;
  metaAdAccountId!: string;
  buyingType?: string;
  specialAdCategory?: string;
  labels?: string[];
  tags?: string[];
}

export class UpdateCampaignDto {
  name?: string;
  objective?: CampaignObjective;
  buyingType?: string;
  specialAdCategory?: string;
  status?: CampaignStatus;
  labels?: string[];
  tags?: string[];
}

export class CampaignResponseDto {
  id!: string;
  workspaceId!: string;
  organizationId!: string;
  metaBusinessId!: string;
  metaAdAccountId!: string;
  name!: string;
  objective!: CampaignObjective;
  buyingType!: string;
  specialAdCategory!: string;
  status!: CampaignStatus;
  draftVersion!: number;
  publishedVersion!: number;
  isPublished!: boolean;
  labels!: string[];
  tags!: string[];
  createdBy!: string;
  updatedBy!: string;
  createdAt!: string;
  updatedAt!: string;
}
