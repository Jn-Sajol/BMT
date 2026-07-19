import { Injectable } from "@nestjs/common"
import { MessengerGroupRepository } from "../../infrastructure/messenger-group.repository"
import { MessengerGroup } from "../../domain/messenger-group.model"

@Injectable()
export class MessengerGroupsSyncService {
  constructor(private readonly messengerGroupRepository: MessengerGroupRepository) {}

  public async syncMessengerGroups(accountId: string): Promise<MessengerGroup[]> {
    console.log(`[MessengerGroupsSyncService] Pulling synced messenger groups for profile: ${accountId}...`)
    
    const mockGroups: MessengerGroup[] = [
      {
        id: `mg-${Date.now()}-1`,
        groupId: "5001",
        name: "BMT Premium Support Chat",
        memberCount: 23,
        status: "Active",
        accountId,
        createdAt: new Date(),
      },
      {
        id: `mg-${Date.now()}-2`,
        groupId: "5002",
        name: "SaaS Sales Executives Discussions",
        memberCount: 8,
        status: "Active",
        accountId,
        createdAt: new Date(),
      },
    ]

    await this.messengerGroupRepository.removeAll()
    return this.messengerGroupRepository.saveAll(mockGroups)
  }

  public async getGroups(): Promise<MessengerGroup[]> {
    return this.messengerGroupRepository.findAll()
  }

  public async getGroupById(id: string): Promise<MessengerGroup | null> {
    return this.messengerGroupRepository.findById(id)
  }
}
