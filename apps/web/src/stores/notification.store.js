"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNotificationStore = void 0;
const zustand_1 = require("zustand");
exports.useNotificationStore = (0, zustand_1.create)((set) => ({
    notifications: [],
    addNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),
    clearAll: () => set({ notifications: [] }),
}));
//# sourceMappingURL=notification.store.js.map