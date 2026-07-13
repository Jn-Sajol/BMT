import { Role, Permission } from '@prisma/client';
import { RoleResponseDto, PermissionResponseDto } from '../dto/rbac.dto';

export class RbacMapper {
  static toRoleResponse(role: Role): RoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      roleType: role.roleType,
      createdAt: role.createdAt.toISOString(),
    };
  }

  static toPermissionResponse(permission: Permission): PermissionResponseDto {
    return {
      id: permission.id,
      actionKey: permission.actionKey,
      description: permission.description,
      createdAt: permission.createdAt.toISOString(),
    };
  }
}
