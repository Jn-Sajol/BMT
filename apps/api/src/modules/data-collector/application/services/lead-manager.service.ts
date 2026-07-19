import { Injectable, NotFoundException } from "@nestjs/common"
import { CollectedLeadRepository } from "../../infrastructure/collected-lead.repository"
import { CollectedLead } from "../../domain/data-collector.model"

@Injectable()
export class LeadManagerService {
  constructor(private readonly collectedLeadRepository: CollectedLeadRepository) {}

  public async getLeads(): Promise<CollectedLead[]> {
    return this.collectedLeadRepository.findAll()
  }

  public async getLeadById(id: string): Promise<CollectedLead> {
    const lead = await this.collectedLeadRepository.findById(id)
    if (!lead) {
      throw new NotFoundException("Collected lead profile not found.")
    }
    return lead
  }

  public async saveLead(lead: CollectedLead): Promise<CollectedLead> {
    return this.collectedLeadRepository.save(lead)
  }

  public async toggleFavorite(id: string): Promise<CollectedLead> {
    const lead = await this.getLeadById(id)
    lead.isFavorite = !lead.isFavorite
    return this.collectedLeadRepository.save(lead)
  }

  public async updateNotes(id: string, notes: string): Promise<CollectedLead> {
    const lead = await this.getLeadById(id)
    lead.notes = notes
    return this.collectedLeadRepository.save(lead)
  }

  public async updateTags(id: string, tags: string[]): Promise<CollectedLead> {
    const lead = await this.getLeadById(id)
    lead.tags = tags
    return this.collectedLeadRepository.save(lead)
  }

  public async loadMockLeads(): Promise<CollectedLead[]> {
    const mocks: CollectedLead[] = [
      {
        id: "lead-1",
        type: "group",
        sourceId: "g-8001",
        name: "Shopify Dropshipping Beginners Hub",
        targetUrl: "https://facebook.com/groups/8001",
        memberCount: 52000,
        activityScore: 88,
        isFavorite: false,
        tags: ["shopify", "ecommerce"],
        createdAt: new Date(),
      },
      {
        id: "lead-2",
        type: "link",
        sourceId: "l-9001",
        name: "Dropshipping Mastermind Chat",
        targetUrl: "https://m.me/j/AbY3zX9aBcD1eF2g/",
        memberCount: 145,
        activityScore: 74,
        isFavorite: false,
        tags: ["dropshipping", "chat"],
        createdAt: new Date(),
      },
    ]
    return this.collectedLeadRepository.saveAll(mocks)
  }
}
