import { IsString, IsOptional, IsNotEmpty, IsObject, IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAutomationRuleDto {
  @ApiProperty({ example: 'Off-Hours Campaign Pauser' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Automatically pauses campaigns at midnight' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: { type: 'Schedule', params: { cron: '0 0 * * *' } } })
  @IsObject()
  @IsNotEmpty()
  trigger!: any;

  @ApiProperty({ example: { type: 'Spend', operator: '>=', value: 100 } })
  @IsObject()
  @IsOptional()
  conditions?: any;

  @ApiProperty({ example: [{ type: 'Pause Campaign', params: { campaignId: '...' } }] })
  @IsArray()
  @IsNotEmpty()
  actions!: any[];

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsOptional()
  schemaVersion?: number;
}

export class UpdateAutomationRuleDto {
  @ApiProperty({ example: 'Off-Hours Campaign Pauser Updated' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'New description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: { type: 'Schedule', params: { cron: '0 1 * * *' } } })
  @IsObject()
  @IsOptional()
  trigger?: any;

  @ApiProperty({ example: { type: 'Spend', operator: '>=', value: 200 } })
  @IsObject()
  @IsOptional()
  conditions?: any;

  @ApiProperty({ example: [{ type: 'Pause Campaign', params: { campaignId: '...' } }] })
  @IsArray()
  @IsOptional()
  actions?: any[];
}
