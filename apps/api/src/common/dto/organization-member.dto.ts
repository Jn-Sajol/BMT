import { IsNotEmpty, IsUUID, IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { MembershipStatus } from '@prisma/client';

export class CreateOrganizationMemberDto {
  @IsUUID('4', { message: 'Organization ID must be a valid UUID v4' })
  @IsNotEmpty()
  organizationId!: string;

  @IsUUID('4', { message: 'User ID must be a valid UUID v4' })
  @IsNotEmpty()
  userId!: string;

  @IsOptional()
  @IsEnum(MembershipStatus, { message: 'Membership status must be INVITED, ACTIVE, SUSPENDED, or REMOVED' })
  status?: MembershipStatus = MembershipStatus.ACTIVE;
}

export class UpdateOrganizationMemberDto {
  @IsEnum(MembershipStatus, { message: 'Membership status must be INVITED, ACTIVE, SUSPENDED, or REMOVED' })
  @IsNotEmpty()
  status!: MembershipStatus;
}

export class OrganizationMemberListDto {
  @IsUUID('4', { message: 'Organization ID must be a valid UUID v4' })
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
  @IsEnum(MembershipStatus)
  status?: MembershipStatus;
}
