export type ExportFormat = "CSV" | "Excel"
export type ExportStatus = "Pending" | "Completed" | "Failed"

export interface ExportJob {
  id: string
  type: "group" | "link"
  format: ExportFormat
  status: ExportStatus
  rowCount: number
  fileUrl?: string
  createdBy: string
  createdAt: Date
}

export interface CollectedLead {
  id: string
  type: "group" | "link"
  sourceId: string
  name: string
  targetUrl: string
  memberCount: number
  activityScore: number
  notes?: string
  isFavorite: boolean
  collectionId?: string
  tags: string[]
  createdAt: Date
}

export interface CollectorSettings {
  defaultFormat: ExportFormat
}
