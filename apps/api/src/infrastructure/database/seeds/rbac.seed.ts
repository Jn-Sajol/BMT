import { Injectable } from '@nestjs/common';
import { PermissionCode } from '../../../common/security/permission.code';
import { PermissionService } from '../../../application/services/permission.service';

@Injectable()
export class RbacSeeder {
  constructor(private readonly permissionService: PermissionService) {}

  async seed(): Promise<void> {
    // 1. Seed Permissions
    for (const code of Object.values(PermissionCode)) {
      try {
        await this.permissionService.createPermission(code, `System permission for ${code}`);
      } catch (e) {
        // Skip duplicate error
      }
    }

    // 2. Seed default Organization Roles
    try {
      await this.permissionService.createRole('ORG_OWNER', 'Full Organization Ownership', 'ORGANIZATION');
      await this.permissionService.createRole('ORG_ADMIN', 'Administrative Organization access', 'ORGANIZATION');
      await this.permissionService.createRole('ORG_MEMBER', 'Standard Organization member', 'ORGANIZATION');
    } catch (e) {}

    // 3. Seed default Workspace Roles
    try {
      await this.permissionService.createRole('WORKSPACE_ADMIN', 'Full Workspace control', 'WORKSPACE');
      await this.permissionService.createRole('WORKSPACE_CREATOR', 'Content creation & editing', 'WORKSPACE');
      await this.permissionService.createRole('WORKSPACE_AUTOMATOR', 'Browser automation control', 'WORKSPACE');
      await this.permissionService.createRole('WORKSPACE_VIEWER', 'Read-only access', 'WORKSPACE');
    } catch (e) {}

    // 4. Map Workspace Admin permissions
    const workspaceAdminPerms = [
      PermissionCode.CAMPAIGN_CREATE,
      PermissionCode.CAMPAIGN_READ,
      PermissionCode.CAMPAIGN_UPDATE,
      PermissionCode.CAMPAIGN_DELETE,
      PermissionCode.WORKSPACE_MEMBER_INVITE,
      PermissionCode.WORKSPACE_MEMBER_REMOVE,
      PermissionCode.WORKSPACE_MEMBER_UPDATE,
      PermissionCode.WORKSPACE_SETTINGS_UPDATE,
      PermissionCode.WORKSPACE_DELETE,
      PermissionCode.FACEBOOK_PAGE_READ,
      PermissionCode.FACEBOOK_PAGE_WRITE,
      PermissionCode.FACEBOOK_ADS_MANAGE,
    ];
    for (const p of workspaceAdminPerms) {
      try {
        await this.permissionService.assignPermissionToRole('WORKSPACE_ADMIN', p);
      } catch (e) {}
    }

    // 5. Map Workspace Creator permissions
    const workspaceCreatorPerms = [
      PermissionCode.CAMPAIGN_CREATE,
      PermissionCode.CAMPAIGN_READ,
      PermissionCode.CAMPAIGN_UPDATE,
      PermissionCode.FACEBOOK_PAGE_READ,
      PermissionCode.FACEBOOK_PAGE_WRITE,
    ];
    for (const p of workspaceCreatorPerms) {
      try {
        await this.permissionService.assignPermissionToRole('WORKSPACE_CREATOR', p);
      } catch (e) {}
    }

    // 6. Map Workspace Automator permissions
    const workspaceAutomatorPerms = [
      PermissionCode.CAMPAIGN_READ,
      PermissionCode.BROWSER_SESSION_CREATE,
      PermissionCode.BROWSER_SESSION_READ,
      PermissionCode.BROWSER_SESSION_DELETE,
    ];
    for (const p of workspaceAutomatorPerms) {
      try {
        await this.permissionService.assignPermissionToRole('WORKSPACE_AUTOMATOR', p);
      } catch (e) {}
    }

    // 7. Map Workspace Viewer permissions
    try {
      await this.permissionService.assignPermissionToRole('WORKSPACE_VIEWER', PermissionCode.CAMPAIGN_READ);
      await this.permissionService.assignPermissionToRole('WORKSPACE_VIEWER', PermissionCode.FACEBOOK_PAGE_READ);
    } catch (e) {}

    // 8. Map Organization Owner permissions
    const orgOwnerPerms = [
      PermissionCode.ORGANIZATION_MEMBER_INVITE,
      PermissionCode.ORGANIZATION_MEMBER_REMOVE,
      PermissionCode.ORGANIZATION_MEMBER_UPDATE,
      PermissionCode.ORGANIZATION_SETTINGS_UPDATE,
      PermissionCode.ORGANIZATION_DELETE,
      PermissionCode.ORGANIZATION_BILLING_MANAGE,
    ];
    for (const p of orgOwnerPerms) {
      try {
        await this.permissionService.assignPermissionToRole('ORG_OWNER', p);
      } catch (e) {}
    }
  }
}
