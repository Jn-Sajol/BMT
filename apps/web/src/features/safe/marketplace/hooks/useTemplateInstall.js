"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTemplateInstall = useTemplateInstall;
const react_query_1 = require("@tanstack/react-query");
const marketplace_service_1 = require("../services/marketplace.service");
function useTemplateInstall() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const installMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ id, payload }) => marketplace_service_1.MarketplaceService.installTemplate(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["marketplace-templates"] });
        },
    });
    const rollbackMutation = (0, react_query_1.useMutation)({
        mutationFn: (id) => marketplace_service_1.MarketplaceService.rollbackTemplate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["marketplace-templates"] });
        },
    });
    return {
        installTemplate: installMutation.mutateAsync,
        isInstalling: installMutation.isPending,
        rollbackTemplate: rollbackMutation.mutateAsync,
        isRollingBack: rollbackMutation.isPending,
    };
}
//# sourceMappingURL=useTemplateInstall.js.map