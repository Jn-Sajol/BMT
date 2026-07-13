import { IsString, IsOptional } from 'class-validator';

export class UpdateAdCreativeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  primaryText?: string;

  @IsString()
  @IsOptional()
  headline?: string;

  @IsString()
  @IsOptional()
  destinationUrl?: string;
}

export class AdCreativeLifecycleHistoryDto {
  id!: string;
  creativeId!: string;
  action!: string;
  beforeStatus!: string;
  afterStatus!: string;
  performedBy!: string;
  performedAt!: string;
  metaResponse?: any;
}
