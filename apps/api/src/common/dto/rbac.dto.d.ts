import { PermissionCode } from '../security/permission.code';
export declare class CreateRoleDto {
    name: string;
    description: string;
    roleType: 'ORGANIZATION' | 'WORKSPACE';
}
export declare class CreatePermissionDto {
    actionKey: PermissionCode;
    description?: string;
}
export declare class AssignPermissionDto {
    roleName: string;
    actionKey: PermissionCode;
}
export declare class RoleResponseDto {
    id: string;
    name: string;
    description: string;
    roleType: string;
    createdAt: string;
}
export declare class PermissionResponseDto {
    id: string;
    actionKey: string;
    description?: string | null;
    createdAt: string;
}
