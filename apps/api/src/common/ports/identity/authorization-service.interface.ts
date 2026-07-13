import { PermissionCode } from '../../security/permission.code';

export interface IAuthorizationService {
  hasPermissionInWorkspace(userId: string, workspaceId: string, requiredPermission: PermissionCode): Promise<boolean>;
  hasPermissionInOrganization(userId: string, organizationId: string, requiredPermission: PermissionCode): Promise<boolean>;
}
