import { IsNotEmpty, IsString, IsUUID, IsOptional, IsInt, Min, Max, Matches, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { WorkspaceType, WorkspaceStatus, WorkspaceVisibility } from '@prisma/client';

export class CreateWorkspaceDto {
  @IsUUID('4', { message: 'Organization ID must be a valid UUID v4' })
  @IsNotEmpty()
  organizationId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Workspace name is required' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Slug is required' })
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug format must contain lowercase alphanumeric characters and hyphens only' })
  slug!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(WorkspaceType, { message: 'Workspace type must be SAFE or ADVANCED' })
  @IsNotEmpty()
  workspaceType!: WorkspaceType;

  @IsOptional()
  @IsEnum(WorkspaceVisibility, { message: 'Visibility must be PRIVATE, TEAM, or ORGANIZATION' })
  visibility?: WorkspaceVisibility = WorkspaceVisibility.ORGANIZATION;
}

export class UpdateWorkspaceDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug format must contain lowercase alphanumeric characters and hyphens only' })
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(WorkspaceVisibility)
  visibility?: WorkspaceVisibility;
}

export class WorkspaceListDto {
  @IsUUID('4')
  @IsNotEmpty()
  organizationId!: string;

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
  @IsEnum(WorkspaceStatus)
  status?: WorkspaceStatus;
}

export class UpdateWorkspaceSettingsDto {
  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  dateFormat?: string;

  @IsOptional()
  @IsString()
  timeFormat?: string;

  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsString()
  defaultLandingPage?: string;

  @IsOptional()
  notificationPrefs?: Record<string, any>;
}

export class UpdateWorkspacePreferencesDto {
  @IsNotEmpty()
  preferences!: Record<string, any>;
}
