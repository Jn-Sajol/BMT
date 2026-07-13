import { CampaignStatus } from '@prisma/client';

export class CreateAdSetDto {
  campaignId!: string;
  name!: string;
  optimizationGoal!: string;
  billingEvent!: string;
  bidStrategy?: string;
  dailyBudget?: number;
  lifetimeBudget?: number;
  startTime!: string;
  endTime?: string;
  attributionSetting?: string;
  targeting!: any;
  promotedObject?: any;
  metaPixelId?: string;
  instagramAccountId?: string;
  facebookPageId?: string;
  labels?: string[];
  tags?: string[];
}

export class UpdateAdSetDto {
  name?: string;
  status?: CampaignStatus;
  optimizationGoal?: string;
  billingEvent?: string;
  bidStrategy?: string;
  dailyBudget?: number;
  lifetimeBudget?: number;
  startTime?: string;
  endTime?: string;
  attributionSetting?: string;
  targeting?: any;
  promotedObject?: any;
  metaPixelId?: string;
  instagramAccountId?: string;
  facebookPageId?: string;
  labels?: string[];
  tags?: string[];
}

export class AdSetResponseDto {
  id!: string;
  campaignId!: string;
  name!: string;
  status!: CampaignStatus;
  optimizationGoal!: string;
  billingEvent!: string;
  bidStrategy?: string;
  dailyBudget?: number;
  lifetimeBudget?: number;
  startTime!: string;
  endTime?: string;
  attributionSetting?: string;
  targeting!: any;
  promotedObject?: any;
  metaPixelId?: string;
  instagramAccountId?: string;
  facebookPageId?: string;
  draftVersion!: number;
  createdBy!: string;
  updatedBy!: string;
  createdAt!: string;
  updatedAt!: string;
  publishedAt?: string;
  publishedBy?: string;
  externalAdSetId?: string;
  labels!: string[];
  tags!: string[];
}
