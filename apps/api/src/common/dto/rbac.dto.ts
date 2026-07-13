import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PermissionCode } from '../security/permission.code';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['ORGANIZATION', 'WORKSPACE'])
  roleType!: 'ORGANIZATION' | 'WORKSPACE';
}

export class CreatePermissionDto {
  @IsEnum(PermissionCode)
  @IsNotEmpty()
  actionKey!: PermissionCode;

  @IsString()
  @IsOptional()
  description?: string;
}

export class AssignPermissionDto {
  @IsString()
  @IsNotEmpty()
  roleName!: string;

  @IsEnum(PermissionCode)
  @IsNotEmpty()
  actionKey!: PermissionCode;
}

export class RoleResponseDto {
  id!: string;
  name!: string;
  description!: string;
  roleType!: string;
  createdAt!: string;
}

export class PermissionResponseDto {
  id!: string;
  actionKey!: string;
  description?: string | null;
  createdAt!: string;
}
