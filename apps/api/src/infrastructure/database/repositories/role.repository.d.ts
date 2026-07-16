import { Role, RolePermission } from '@prisma/client';
import { IRoleRepository } from '../../../common/ports/identity/role-repository.interface';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class RoleRepository implements IRoleRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<Role | null>;
    findByName(name: string): Promise<Role | null>;
    findRolesByUserIdForWorkspace(userId: string, workspaceId: string): Promise<Role[]>;
    findRolesByUserIdForOrganization(userId: string, organizationId: string): Promise<Role[]>;
    assignPermissionToRole(roleId: string, permissionId: string): Promise<RolePermission>;
    revokePermissionFromRole(roleId: string, permissionId: string): Promise<void>;
    assignWorkspaceRole(userId: string, workspaceId: string, roleId: string): Promise<void>;
    revokeWorkspaceRole(userId: string, workspaceId: string, roleId: string): Promise<void>;
    assignOrganizationRole(userId: string, organizationId: string, roleId: string): Promise<void>;
    findUserWorkspaceRoles(userId: string): Promise<any[]>;
    findUserOrganizationRoles(userId: string): Promise<any[]>;
    findAll(): Promise<Role[]>;
    save(entity: Role): Promise<Role>;
    delete(id: string): Promise<void>;
}
