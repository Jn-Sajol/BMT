import { create } from "zustand"

export interface AlertNotification {
  id: string
  title: string
  message: string
  priority: string
  createdAt: string
}

interface NotificationState {
  notifications: AlertNotification[]
  addNotification: (notification: AlertNotification) => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({ notifications: [notification, ...state.notifications] })),
  clearAll: () => set({ notifications: [] }),
}))
