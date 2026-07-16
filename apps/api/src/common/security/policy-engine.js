"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyEngine = void 0;
const permission_code_1 = require("./permission.code");
class PolicyEngine {
    static evaluate(user, resource, action, userPermissions, context) {
        // 1. Deny non-active users access to any system resources
        if (user.status !== 'ACTIVE') {
            return false;
        }
        // 2. RBAC check: user must possess the permission key
        if (!userPermissions.includes(action)) {
            return false;
        }
        // 3. ABAC checks:
        // Only ADVANCED workspaces support browser session allocations
        if (action.startsWith('browser.session') && resource.workspaceType !== 'ADVANCED') {
            return false;
        }
        // Ownership check for deletes: must be owner or administrative bypass
        if (action === permission_code_1.PermissionCode.CAMPAIGN_DELETE && resource.ownerId && resource.ownerId !== user.id) {
            const isManager = userPermissions.includes(permission_code_1.PermissionCode.ORGANIZATION_DELETE) ||
                userPermissions.includes(permission_code_1.PermissionCode.WORKSPACE_SETTINGS_UPDATE);
            if (!isManager) {
                return false;
            }
        }
        return true;
    }
}
exports.PolicyEngine = PolicyEngine;
//# sourceMappingURL=policy-engine.js.map