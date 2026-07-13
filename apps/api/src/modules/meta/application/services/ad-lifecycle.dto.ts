import { IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateAdDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  creativeId?: string;

  @IsObject()
  @IsOptional()
  trackingSpecs?: any;
}

export class AdLifecycleHistoryDto {
  id!: string;
  adId!: string;
  action!: string;
  beforeStatus!: string;
  afterStatus!: string;
  performedBy!: string;
  performedAt!: string;
  metaResponse?: any;
}
