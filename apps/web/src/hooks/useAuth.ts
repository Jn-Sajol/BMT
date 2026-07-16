import { useMutation } from "@tanstack/react-query"
import { useAuthStore, type User } from "../stores/auth.store"
import { AuthService } from "../services/auth.service"

export function useAuth() {
  const { user, token, setSession, clearSession } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data: { token: string; refreshToken: string; user: User }) => {
      setSession(data.token, data.refreshToken, data.user)
    },
  })

  const registerMutation = useMutation({
    mutationFn: AuthService.register,
  })

  return {
    user,
    token,
    isAuthenticated: !!token,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: clearSession,
  }
}
