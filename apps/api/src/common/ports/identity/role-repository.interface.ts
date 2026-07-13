import { IRepository } from '../repository.port';
import { Role, RolePermission } from '@prisma/client';

export interface IRoleRepository extends IRepository<Role> {
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
}
