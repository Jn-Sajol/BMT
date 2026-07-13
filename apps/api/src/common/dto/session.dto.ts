import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSessionDto {
  @IsUUID('4')
  @IsNotEmpty()
  userId!: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  device?: string;

  @IsOptional()
  @IsString()
  browser?: string;

  @IsOptional()
  @IsString()
  os?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  tokenHash?: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean = false;
}

export class SessionResponseDto {
  id!: string;
  userId!: string;
  tokenHash!: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  device?: string | null;
  browser?: string | null;
  os?: string | null;
  country?: string | null;
  city?: string | null;
  lastActivityAt!: string;
  expiresAt!: string;
  createdAt!: string;
}
