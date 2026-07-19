import { Injectable } from "@nestjs/common"
import { FacebookGroupRepository } from "../../infrastructure/facebook-group.repository"
import { FacebookGroup } from "../../domain/facebook-group.model"

@Injectable()
export class FacebookGroupsSyncService {
  constructor(private readonly facebookGroupRepository: FacebookGroupRepository) {}

  public async syncJoinedGroups(accountId: string): Promise<FacebookGroup[]> {
    console.log(`[FacebookGroupsSyncService] Querying official Graph API for account: ${accountId} joined groups...`)
    
    // Simulate synced groups list
    const mockGroups: FacebookGroup[] = [
      {
        id: `g-${Date.now()}-1`,
        groupId: "1001",
        name: "Marketing Automation Professionals",
        memberCount: 15400,
        privacy: "OPEN",
        accountId,
        createdAt: new Date(),
      },
      {
        id: `g-${Date.now()}-2`,
        groupId: "1002",
        name: "SaaS Builders Club",
        memberCount: 8900,
        privacy: "OPEN",
        accountId,
        createdAt: new Date(),
      },
    ]

    await this.facebookGroupRepository.removeAll()
    return this.facebookGroupRepository.saveAll(mockGroups)
  }

  public async getGroups(): Promise<FacebookGroup[]> {
    return this.facebookGroupRepository.findAll()
  }

  public async getGroupById(id: string): Promise<FacebookGroup | null> {
    return this.facebookGroupRepository.findById(id)
  }
}
