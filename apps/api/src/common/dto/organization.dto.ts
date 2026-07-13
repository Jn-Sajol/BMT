import { IsNotEmpty, IsString, IsUUID, IsOptional, IsInt, Min, Max, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty({ message: 'Organization name is required' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Slug is required' })
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug format must contain lowercase alphanumeric characters and hyphens only' })
  slug!: string;

  @IsUUID('4', { message: 'Owner user ID must be a valid UUID v4' })
  @IsNotEmpty()
  ownerUserId!: string;
}

export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Organization name cannot be empty' })
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Slug cannot be empty' })
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug format must contain lowercase alphanumeric characters and hyphens only' })
  slug?: string;
}

export class OrganizationListDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsString()
  status?: string;
}
