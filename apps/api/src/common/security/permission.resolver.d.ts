import { PermissionCode } from './permission.code';
export declare class PermissionResolver {
    static resolveModule(action: PermissionCode): string;
    static resolveResource(action: PermissionCode): string;
    static resolveAction(action: PermissionCode): string;
    static matchesPattern(action: PermissionCode, pattern: string): boolean;
}
