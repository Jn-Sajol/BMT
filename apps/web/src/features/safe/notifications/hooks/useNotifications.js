"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNotifications = useNotifications;
const react_query_1 = require("@tanstack/react-query");
const notification_service_1 = require("../services/notification.service");
function useNotifications() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const { data: notifications, isLoading } = (0, react_query_1.useQuery)({
        queryKey: ["notifications"],
        queryFn: notification_service_1.NotificationService.list,
        initialData: [],
    });
    const updateConfigMutation = (0, react_query_1.useMutation)({
        mutationFn: notification_service_1.NotificationService.updateSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
    return {
        notifications,
        isLoadingNotifications: isLoading,
        updateSettings: updateConfigMutation.mutateAsync,
        isUpdatingSettings: updateConfigMutation.isPending,
    };
}
//# sourceMappingURL=useNotifications.js.map