import { IsString, IsOptional, IsNumber, IsDateString, IsObject } from 'class-validator';

export class UpdateAdSetDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  dailyBudget?: number;

  @IsNumber()
  @IsOptional()
  lifetimeBudget?: number;

  @IsNumber()
  @IsOptional()
  bidAmount?: number;

  @IsString()
  @IsOptional()
  bidStrategy?: string;

  @IsString()
  @IsOptional()
  optimizationGoal?: string;

  @IsString()
  @IsOptional()
  billingEvent?: string;

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;

  @IsObject()
  @IsOptional()
  targeting?: any;
}

export class AdSetLifecycleHistoryDto {
  id!: string;
  adSetId!: string;
  action!: string;
  beforeStatus!: string;
  afterStatus!: string;
  performedBy!: string;
  performedAt!: string;
  metaResponse?: any;
}
