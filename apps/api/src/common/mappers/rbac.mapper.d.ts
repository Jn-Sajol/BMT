import { Role, Permission } from '@prisma/client';
import { RoleResponseDto, PermissionResponseDto } from '../dto/rbac.dto';
export declare class RbacMapper {
    static toRoleResponse(role: Role): RoleResponseDto;
    static toPermissionResponse(permission: Permission): PermissionResponseDto;
}
