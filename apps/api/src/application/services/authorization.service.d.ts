import { PermissionCode } from '../../common/security/permission.code';
import { IAuthorizationService } from '../../common/ports/identity/authorization-service.interface';
import { PermissionService } from './permission.service';
export declare class AuthorizationService implements IAuthorizationService {
    private readonly permissionService;
    constructor(permissionService: PermissionService);
    hasPermissionInWorkspace(userId: string, workspaceId: string, requiredPermission: PermissionCode): Promise<boolean>;
    hasPermissionInOrganization(userId: string, organizationId: string, requiredPermission: PermissionCode): Promise<boolean>;
}
