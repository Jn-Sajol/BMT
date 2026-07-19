export interface CollectorReport {
  id: string
  totalExports: number
  totalCollectedLeads: number
  exportsByType: Record<string, number>
  leadsByType: Record<string, number>
}
