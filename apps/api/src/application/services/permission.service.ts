import { Injectable } from '@nestjs/common';
import { Permission, Role } from '@prisma/client';
import { PermissionCode } from '../../common/security/permission.code';
import { IPermissionService } from '../../common/ports/identity/permission-service.interface';
import { PermissionRepository } from '../../infrastructure/database/repositories/permission.repository';
import { RoleRepository } from '../../infrastructure/database/repositories/role.repository';
import { 
  PermissionAlreadyExistsException, 
  RoleAlreadyExistsException, 
  RoleNotFoundException, 
  PermissionNotFoundException 
} from '../../common/exceptions/rbac-exceptions';

@Injectable()
export class PermissionService implements IPermissionService {
  constructor(
    private readonly permissionRepo: PermissionRepository,
    private readonly roleRepo: RoleRepository,
  ) {}

  async createPermission(actionKey: PermissionCode, description?: string): Promise<Permission> {
    const existing = await this.permissionRepo.findByActionKey(actionKey);
    if (existing) {
      throw new PermissionAlreadyExistsException(actionKey);
    }

    const permission: Permission = {
      id: '',
      actionKey,
      description: description || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.permissionRepo.save(permission);
  }

  async createRole(name: string, description: string, roleType: 'ORGANIZATION' | 'WORKSPACE'): Promise<Role> {
    const existing = await this.roleRepo.findByName(name);
    if (existing) {
      throw new RoleAlreadyExistsException(name);
    }

    const role: Role = {
      id: '',
      name,
      description,
      roleType,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.roleRepo.save(role);
  }

  async assignPermissionToRole(roleName: string, actionKey: PermissionCode): Promise<void> {
    const role = (await this.roleRepo.findByName(roleName)) as any;
    if (!role) {
      throw new RoleNotFoundException(roleName);
    }

    const permission = await this.permissionRepo.findByActionKey(actionKey);
    if (!permission) {
      throw new PermissionNotFoundException(actionKey);
    }

    // Check if association already exists
    const hasAssociation = role.permissions?.some(
      (rp: any) => rp.permissionId === permission.id
    );

    if (!hasAssociation) {
      await this.roleRepo.assignPermissionToRole(role.id, permission.id);
    }
  }

  async getUserPermissionsForWorkspace(userId: string, workspaceId: string): Promise<PermissionCode[]> {
    const roles = await this.roleRepo.findRolesByUserIdForWorkspace(userId, workspaceId);
    const actionKeys = new Set<PermissionCode>();

    for (const role of roles) {
      const dbRole = (await this.roleRepo.findById(role.id)) as any;
      if (dbRole?.permissions) {
        for (const rp of dbRole.permissions) {
          actionKeys.add(rp.permission.actionKey as PermissionCode);
        }
      }
    }

    return Array.from(actionKeys);
  }

  async getUserPermissionsForOrganization(userId: string, organizationId: string): Promise<PermissionCode[]> {
    const roles = await this.roleRepo.findRolesByUserIdForOrganization(userId, organizationId);
    const actionKeys = new Set<PermissionCode>();

    for (const role of roles) {
      const dbRole = (await this.roleRepo.findById(role.id)) as any;
      if (dbRole?.permissions) {
        for (const rp of dbRole.permissions) {
          actionKeys.add(rp.permission.actionKey as PermissionCode);
        }
      }
    }

    return Array.from(actionKeys);
  }
}
