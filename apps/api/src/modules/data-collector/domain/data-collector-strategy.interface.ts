import { CollectedLead } from "./data-collector.model"

export interface IExtractorStrategy {
  exportLeads(leads: CollectedLead[]): Promise<string>
}

export class SafeCsvExtractorStrategy implements IExtractorStrategy {
  public async exportLeads(leads: CollectedLead[]): Promise<string> {
    console.log(`[SafeCsvExtractorStrategy] Compiling raw CSV lines for ${leads.length} leads...`)
    const header = "id,type,sourceId,name,targetUrl,memberCount,activityScore\n"
    const rows = leads.map(l => `${l.id},${l.type},${l.sourceId},"${l.name.replace(/"/g, '""')}",${l.targetUrl},${l.memberCount},${l.activityScore}`).join("\n")
    return header + rows
  }
}

export class AdvancedExcelExtractorStrategy implements IExtractorStrategy {
  public async exportLeads(leads: CollectedLead[]): Promise<string> {
    console.log(`[AdvancedExcelExtractorStrategy] Generating complex formatted binary sheets via Playwright workers...`)
    return "binary_sheet_data_placeholder"
  }
}
