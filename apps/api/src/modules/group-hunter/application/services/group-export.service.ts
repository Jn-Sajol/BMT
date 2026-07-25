import { Injectable } from "@nestjs/common"
import { GroupCandidateQueueItem } from "./group-candidate-queue.service"

export type ExportFormat = "CSV" | "JSON" | "EXCEL"

export interface ExportResult {
  format: ExportFormat
  filename: string
  content: string
  recordCount: number
  exportedAt: Date
}

@Injectable()
export class GroupExportService {
  public exportCandidates(candidates: GroupCandidateQueueItem[], format: ExportFormat): ExportResult {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")

    if (format === "JSON") {
      const filename = `group_candidates_${timestamp}.json`
      const content = JSON.stringify(candidates, null, 2)
      return { format: "JSON", filename, content, recordCount: candidates.length, exportedAt: new Date() }
    }

    // CSV and EXCEL (CSV tab-separated for Excel readiness)
    const delimiter = format === "EXCEL" ? "\t" : ","
    const headers = ["CandidateID", "GroupID", "GroupName", "GroupURL", "Score", "Rank", "Status", "AddedAt"]
    
    const rows = candidates.map((c) => [
      c.candidateId,
      c.groupId,
      `"${c.groupName.replace(/"/g, '""')}"`,
      c.groupUrl,
      c.scoreResult.numericScore,
      c.scoreResult.rank,
      c.status,
      c.addedAt.toISOString()
    ])

    const filename = `group_candidates_${timestamp}.${format === "EXCEL" ? "xls" : "csv"}`
    const content = [headers.join(delimiter), ...rows.map((r) => r.join(delimiter))].join("\n")

    return {
      format,
      filename,
      content,
      recordCount: candidates.length,
      exportedAt: new Date()
    }
  }
}
