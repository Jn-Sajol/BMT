"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissions = exports.Permission = void 0;
exports.hasPermission = hasPermission;
const roles_1 = require("./roles");
var Permission;
(function (Permission) {
    Permission["VIEW_ANALYTICS"] = "VIEW_ANALYTICS";
    Permission["VIEW_RECOMMENDATIONS"] = "VIEW_RECOMMENDATIONS";
    Permission["MANAGE_WORKFLOWS"] = "MANAGE_WORKFLOWS";
    Permission["INSTALL_TEMPLATES"] = "INSTALL_TEMPLATES";
    Permission["MANAGE_MEMBERS"] = "MANAGE_MEMBERS";
    Permission["TRIGGER_DANGER_ZONE"] = "TRIGGER_DANGER_ZONE";
})(Permission || (exports.Permission = Permission = {}));
exports.RolePermissions = {
    [roles_1.UserRole.OWNER]: [
        Permission.VIEW_ANALYTICS,
        Permission.VIEW_RECOMMENDATIONS,
        Permission.MANAGE_WORKFLOWS,
        Permission.INSTALL_TEMPLATES,
        Permission.MANAGE_MEMBERS,
        Permission.TRIGGER_DANGER_ZONE,
    ],
    [roles_1.UserRole.ADMIN]: [
        Permission.VIEW_ANALYTICS,
        Permission.VIEW_RECOMMENDATIONS,
        Permission.MANAGE_WORKFLOWS,
        Permission.INSTALL_TEMPLATES,
        Permission.MANAGE_MEMBERS,
    ],
    [roles_1.UserRole.DEVELOPER]: [
        Permission.VIEW_ANALYTICS,
        Permission.VIEW_RECOMMENDATIONS,
        Permission.MANAGE_WORKFLOWS,
        Permission.INSTALL_TEMPLATES,
    ],
    [roles_1.UserRole.ANALYST]: [
        Permission.VIEW_ANALYTICS,
        Permission.VIEW_RECOMMENDATIONS,
    ],
    [roles_1.UserRole.MEMBER]: [
        Permission.VIEW_ANALYTICS,
    ],
};
function hasPermission(role, permission) {
    return exports.RolePermissions[role]?.includes(permission) ?? false;
}
//# sourceMappingURL=permissions.js.map