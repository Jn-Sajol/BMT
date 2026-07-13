import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionCode } from '../security/permission.code';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AuthorizationService } from '../../application/services/authorization.service';
import { ForbiddenPermissionException } from '../exceptions/rbac-exceptions';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<PermissionCode[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return false; // Authentication required
    }

    const workspaceId = request.headers['x-workspace-id'] || request.params.workspaceId || request.query.workspaceId;
    const organizationId = request.headers['x-organization-id'] || request.params.organizationId || request.query.organizationId;

    for (const permission of requiredPermissions) {
      let allowed = false;

      if (workspaceId) {
        allowed = await this.authService.hasPermissionInWorkspace(user.id, workspaceId, permission);
      } else if (organizationId) {
        allowed = await this.authService.hasPermissionInOrganization(user.id, organizationId, permission);
      } else {
        // Fallback: request has no context, reject
        return false;
      }

      if (!allowed) {
        throw new ForbiddenPermissionException(permission);
      }
    }

    return true;
  }
}
