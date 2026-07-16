"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDashboardData = useDashboardData;
const react_query_1 = require("@tanstack/react-query");
const dashboard_service_1 = require("../services/dashboard.service");
function useDashboardData() {
    const kpiQuery = (0, react_query_1.useQuery)({
        queryKey: ["safe-dashboard-kpis"],
        queryFn: dashboard_service_1.DashboardService.getKPIs,
    });
    const activitiesQuery = (0, react_query_1.useQuery)({
        queryKey: ["safe-dashboard-activities"],
        queryFn: dashboard_service_1.DashboardService.getRecentActivities,
        initialData: [],
    });
    return {
        kpis: kpiQuery.data || { monitoredSpend: 0, recommendationsCount: 0, healthScore: 100 },
        isLoadingKPIs: kpiQuery.isLoading,
        activities: activitiesQuery.data,
        isLoadingActivities: activitiesQuery.isLoading,
    };
}
//# sourceMappingURL=useDashboardData.js.map