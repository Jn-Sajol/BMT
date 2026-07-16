export interface AlertNotification {
    id: string;
    title: string;
    message: string;
    priority: string;
    createdAt: string;
}
interface NotificationState {
    notifications: AlertNotification[];
    addNotification: (notification: AlertNotification) => void;
    clearAll: () => void;
}
export declare const useNotificationStore: import("zustand").UseBoundStore<import("zustand").StoreApi<NotificationState>>;
export {};
