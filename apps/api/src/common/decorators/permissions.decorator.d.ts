import { PermissionCode } from '../security/permission.code';
export declare const PERMISSIONS_KEY = "permissions";
export declare const RequirePermissions: (...permissions: PermissionCode[]) => import("@nestjs/common").CustomDecorator<string>;
