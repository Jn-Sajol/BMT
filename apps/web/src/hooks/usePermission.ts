import { useAuthStore } from "../stores/auth.store"
import { hasPermission, type Permission } from "../lib/permissions"
import { UserRole } from "../lib/roles"

export function usePermission() {
  const user = useAuthStore((state) => state.user)

  return {
    checkPermission: (permission: Permission) => {
      if (!user) return false
      return hasPermission(user.role as UserRole, permission)
    },
    role: user?.role || null,
  }
}
