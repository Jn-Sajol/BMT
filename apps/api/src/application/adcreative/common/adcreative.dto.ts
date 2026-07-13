import { CampaignStatus } from '@prisma/client';

export class CreateAdCreativeDto {
  campaignId!: string;
  creativeType!: string;
  name!: string;
  primaryText!: string;
  headline!: string;
  description?: string;
  callToAction!: string;
  destinationUrl!: string;
  displayLink?: string;
  caption?: string;
  linkDescription?: string;
  facebookPageId?: string;
  instagramAccountId?: string;
  mediaType?: string;
  mediaAssetId?: string;
  thumbnailAssetId?: string;
  pixelId?: string;
  trackingParameters?: any;
  creativeSpec?: any;
  labels?: string[];
  tags?: string[];
}

export class UpdateAdCreativeDto {
  name?: string;
  creativeType?: string;
  primaryText?: string;
  headline?: string;
  description?: string;
  callToAction?: string;
  destinationUrl?: string;
  displayLink?: string;
  caption?: string;
  linkDescription?: string;
  facebookPageId?: string;
  instagramAccountId?: string;
  mediaType?: string;
  mediaAssetId?: string;
  thumbnailAssetId?: string;
  pixelId?: string;
  trackingParameters?: any;
  creativeSpec?: any;
  status?: CampaignStatus;
  labels?: string[];
  tags?: string[];
}

export class AdCreativeResponseDto {
  id!: string;
  campaignId!: string;
  creativeType!: string;
  name!: string;
  primaryText!: string;
  headline!: string;
  description?: string;
  callToAction!: string;
  destinationUrl!: string;
  displayLink?: string;
  caption?: string;
  linkDescription?: string;
  facebookPageId?: string;
  instagramAccountId?: string;
  mediaType?: string;
  mediaAssetId?: string;
  thumbnailAssetId?: string;
  pixelId?: string;
  trackingParameters!: any;
  creativeSpec!: any;
  status!: CampaignStatus;
  draftVersion!: number;
  externalCreativeId?: string;
  publishedAt?: string;
  createdBy!: string;
  updatedBy!: string;
  createdAt!: string;
  updatedAt!: string;
  labels!: string[];
  tags!: string[];
}
