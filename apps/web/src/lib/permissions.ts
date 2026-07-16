import { UserRole } from "./roles"

export enum Permission {
  VIEW_ANALYTICS = "VIEW_ANALYTICS",
  VIEW_RECOMMENDATIONS = "VIEW_RECOMMENDATIONS",
  MANAGE_WORKFLOWS = "MANAGE_WORKFLOWS",
  INSTALL_TEMPLATES = "INSTALL_TEMPLATES",
  MANAGE_MEMBERS = "MANAGE_MEMBERS",
  TRIGGER_DANGER_ZONE = "TRIGGER_DANGER_ZONE",
}

export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.OWNER]: [
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_RECOMMENDATIONS,
    Permission.MANAGE_WORKFLOWS,
    Permission.INSTALL_TEMPLATES,
    Permission.MANAGE_MEMBERS,
    Permission.TRIGGER_DANGER_ZONE,
  ],
  [UserRole.ADMIN]: [
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_RECOMMENDATIONS,
    Permission.MANAGE_WORKFLOWS,
    Permission.INSTALL_TEMPLATES,
    Permission.MANAGE_MEMBERS,
  ],
  [UserRole.DEVELOPER]: [
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_RECOMMENDATIONS,
    Permission.MANAGE_WORKFLOWS,
    Permission.INSTALL_TEMPLATES,
  ],
  [UserRole.ANALYST]: [
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_RECOMMENDATIONS,
  ],
  [UserRole.MEMBER]: [
    Permission.VIEW_ANALYTICS,
  ],
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return RolePermissions[role]?.includes(permission) ?? false
}
