"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMarketplaceTemplates = useMarketplaceTemplates;
const react_query_1 = require("@tanstack/react-query");
const marketplace_service_1 = require("../services/marketplace.service");
function useMarketplaceTemplates() {
    const { data: templates, isLoading } = (0, react_query_1.useQuery)({
        queryKey: ["marketplace-templates"],
        queryFn: marketplace_service_1.MarketplaceService.listTemplates,
        initialData: [],
    });
    return {
        templates,
        isLoadingTemplates: isLoading,
    };
}
//# sourceMappingURL=useMarketplaceTemplates.js.map