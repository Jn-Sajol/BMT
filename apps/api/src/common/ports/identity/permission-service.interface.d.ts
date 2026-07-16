import { Permission, Role } from '@prisma/client';
import { PermissionCode } from '../../security/permission.code';
export interface IPermissionService {
    createPermission(actionKey: PermissionCode, description?: string): Promise<Permission>;
    createRole(name: string, description: string, roleType: 'ORGANIZATION' | 'WORKSPACE'): Promise<Role>;
    assignPermissionToRole(roleName: string, actionKey: PermissionCode): Promise<void>;
    getUserPermissionsForWorkspace(userId: string, workspaceId: string): Promise<PermissionCode[]>;
    getUserPermissionsForOrganization(userId: string, organizationId: string): Promise<PermissionCode[]>;
}
