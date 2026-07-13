import { CampaignStatus } from '@prisma/client';

export class CreateAdDto {
  campaignId!: string;
  adSetId!: string;
  creativeId!: string;
  name!: string;
  trackingSpecs?: any;
  labels?: string[];
  tags?: string[];
}

export class UpdateAdDto {
  name?: string;
  trackingSpecs?: any;
  status?: CampaignStatus;
  labels?: string[];
  tags?: string[];
}

export class AdResponseDto {
  id!: string;
  workspaceId!: string;
  campaignId!: string;
  adSetId!: string;
  creativeId!: string;
  name!: string;
  status!: CampaignStatus;
  draftVersion!: number;
  externalAdId?: string;
  publishedAt?: string;
  publishedBy?: string;
  trackingSpecs!: any;
  displayStatus?: string;
  reviewStatus?: string;
  createdBy!: string;
  updatedBy!: string;
  createdAt!: string;
  updatedAt!: string;
  labels!: string[];
  tags!: string[];
}
