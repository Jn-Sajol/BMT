import { Injectable } from "@nestjs/common"
import { CollectedLead } from "../domain/data-collector.model"

@Injectable()
export class CollectedLeadRepository {
  private leads: CollectedLead[] = []

  public async save(lead: CollectedLead): Promise<CollectedLead> {
    const idx = this.leads.findIndex((l) => l.id === lead.id)
    if (idx >= 0) {
      this.leads[idx] = lead
    } else {
      this.leads.push(lead)
    }
    return lead
  }

  public async saveAll(leads: CollectedLead[]): Promise<CollectedLead[]> {
    for (const lead of leads) {
      await this.save(lead)
    }
    return this.leads
  }

  public async findById(id: string): Promise<CollectedLead | null> {
    return this.leads.find((l) => l.id === id) || null
  }

  public async findAll(): Promise<CollectedLead[]> {
    return this.leads
  }
}
