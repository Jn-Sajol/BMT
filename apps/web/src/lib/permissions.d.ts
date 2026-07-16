import { UserRole } from "./roles";
export declare enum Permission {
    VIEW_ANALYTICS = "VIEW_ANALYTICS",
    VIEW_RECOMMENDATIONS = "VIEW_RECOMMENDATIONS",
    MANAGE_WORKFLOWS = "MANAGE_WORKFLOWS",
    INSTALL_TEMPLATES = "INSTALL_TEMPLATES",
    MANAGE_MEMBERS = "MANAGE_MEMBERS",
    TRIGGER_DANGER_ZONE = "TRIGGER_DANGER_ZONE"
}
export declare const RolePermissions: Record<UserRole, Permission[]>;
export declare function hasPermission(role: UserRole, permission: Permission): boolean;
