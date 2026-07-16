import { PermissionCode } from './permission.code';
export interface PolicyUser {
    id: string;
    status: string;
}
export interface PolicyResource {
    id: string;
    ownerId?: string;
    organizationId?: string;
    workspaceId?: string;
    workspaceType?: 'SAFE' | 'ADVANCED';
}
export interface PolicyContext {
    ipAddress?: string;
    currentTime?: Date;
}
export declare class PolicyEngine {
    static evaluate(user: PolicyUser, resource: PolicyResource, action: PermissionCode, userPermissions: PermissionCode[], context?: PolicyContext): boolean;
}
