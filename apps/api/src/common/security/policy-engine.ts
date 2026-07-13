import { PermissionCode } from './permission.code';

export interface PolicyUser {
  id: string;
  status: string;
}

export interface PolicyResource {
  id: string;
  ownerId?: string;
  organizationId?: string;
  workspaceId?: string;
  workspaceType?: 'SAFE' | 'ADVANCED';
}

export interface PolicyContext {
  ipAddress?: string;
  currentTime?: Date;
}

export class PolicyEngine {
  static evaluate(
    user: PolicyUser,
    resource: PolicyResource,
    action: PermissionCode,
    userPermissions: PermissionCode[],
    context?: PolicyContext,
  ): boolean {
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
    if (action === PermissionCode.CAMPAIGN_DELETE && resource.ownerId && resource.ownerId !== user.id) {
      const isManager = userPermissions.includes(PermissionCode.ORGANIZATION_DELETE) ||
                        userPermissions.includes(PermissionCode.WORKSPACE_SETTINGS_UPDATE);
      if (!isManager) {
        return false;
      }
    }

    return true;
  }
}
