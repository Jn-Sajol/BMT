import { Injectable } from '@nestjs/common';
import { PermissionCode } from '../../common/security/permission.code';
import { IAuthorizationService } from '../../common/ports/identity/authorization-service.interface';
import { PermissionService } from './permission.service';

@Injectable()
export class AuthorizationService implements IAuthorizationService {
  constructor(private readonly permissionService: PermissionService) {}

  async hasPermissionInWorkspace(
    userId: string,
    workspaceId: string,
    requiredPermission: PermissionCode,
  ): Promise<boolean> {
    const userPermissions = await this.permissionService.getUserPermissionsForWorkspace(
      userId,
      workspaceId,
    );
    return userPermissions.includes(requiredPermission);
  }

  async hasPermissionInOrganization(
    userId: string,
    organizationId: string,
    requiredPermission: PermissionCode,
  ): Promise<boolean> {
    const userPermissions = await this.permissionService.getUserPermissionsForOrganization(
      userId,
      organizationId,
    );
    return userPermissions.includes(requiredPermission);
  }
}
