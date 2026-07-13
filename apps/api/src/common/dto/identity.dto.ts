export class CreateUserDto {
  email!: string;
  name?: string;
  password!: string;
}

export class CreateUserSessionDto {
  userId!: string;
  ipAddress?: string;
  userAgent?: string;
}

export class CreateUserInvitationDto {
  email!: string;
  tenantId?: string;
  workspaceId?: string;
  roleId?: string;
}
