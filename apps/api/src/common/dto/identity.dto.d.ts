export declare class CreateUserDto {
    email: string;
    name?: string;
    password: string;
}
export declare class CreateUserSessionDto {
    userId: string;
    ipAddress?: string;
    userAgent?: string;
}
export declare class CreateUserInvitationDto {
    email: string;
    tenantId?: string;
    workspaceId?: string;
    roleId?: string;
}
