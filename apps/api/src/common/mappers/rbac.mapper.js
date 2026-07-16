"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacMapper = void 0;
class RbacMapper {
    static toRoleResponse(role) {
        return {
            id: role.id,
            name: role.name,
            description: role.description,
            roleType: role.roleType,
            createdAt: role.createdAt.toISOString(),
        };
    }
    static toPermissionResponse(permission) {
        return {
            id: permission.id,
            actionKey: permission.actionKey,
            description: permission.description,
            createdAt: permission.createdAt.toISOString(),
        };
    }
}
exports.RbacMapper = RbacMapper;
//# sourceMappingURL=rbac.mapper.js.map