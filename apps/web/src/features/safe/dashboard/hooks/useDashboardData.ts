import { useQuery } from "@tanstack/react-query"
import { DashboardService } from "../services/dashboard.service"

export function useDashboardData() {
  const kpiQuery = useQuery({
    queryKey: ["safe-dashboard-kpis"],
    queryFn: DashboardService.getKPIs,
  })

  const activitiesQuery = useQuery({
    queryKey: ["safe-dashboard-activities"],
    queryFn: DashboardService.getRecentActivities,
    initialData: [],
  })

  return {
    kpis: kpiQuery.data || { monitoredSpend: 0, recommendationsCount: 0, healthScore: 100 },
    isLoadingKPIs: kpiQuery.isLoading,
    activities: activitiesQuery.data,
    isLoadingActivities: activitiesQuery.isLoading,
  }
}
