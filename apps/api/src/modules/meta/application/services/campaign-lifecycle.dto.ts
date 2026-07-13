import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateCampaignDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  specialAdCategories?: string;

  @IsString()
  @IsOptional()
  buyingType?: string;

  @IsNumber()
  @IsOptional()
  dailyBudget?: number;

  @IsNumber()
  @IsOptional()
  lifetimeBudget?: number;
}

export class CampaignLifecycleHistoryDto {
  id!: string;
  campaignId!: string;
  action!: string;
  beforeStatus!: string;
  afterStatus!: string;
  performedBy!: string;
  performedAt!: string;
  metaResponse?: any;
}
