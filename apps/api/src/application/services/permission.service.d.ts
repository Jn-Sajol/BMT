import { Permission, Role } from '@prisma/client';
import { PermissionCode } from '../../common/security/permission.code';
import { IPermissionService } from '../../common/ports/identity/permission-service.interface';
import { PermissionRepository } from '../../infrastructure/database/repositories/permission.repository';
import { RoleRepository } from '../../infrastructure/database/repositories/role.repository';
export declare class PermissionService implements IPermissionService {
    private readonly permissionRepo;
    private readonly roleRepo;
    constructor(permissionRepo: PermissionRepository, roleRepo: RoleRepository);
    createPermission(actionKey: PermissionCode, description?: string): Promise<Permission>;
    createRole(name: string, description: string, roleType: 'ORGANIZATION' | 'WORKSPACE'): Promise<Role>;
    assignPermissionToRole(roleName: string, actionKey: PermissionCode): Promise<void>;
    getUserPermissionsForWorkspace(userId: string, workspaceId: string): Promise<PermissionCode[]>;
    getUserPermissionsForOrganization(userId: string, organizationId: string): Promise<PermissionCode[]>;
}
