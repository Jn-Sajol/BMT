import { Injectable, NotFoundException } from "@nestjs/common"
import { InstagramDMRepository } from "../../infrastructure/instagram-dm.repository"
import { InstagramDMThread, InstagramDM } from "../../domain/instagram.model"

@Injectable()
export class InstagramInboxService {
  constructor(private readonly instagramDMRepository: InstagramDMRepository) {}

  public async getThreads(): Promise<InstagramDMThread[]> {
    return this.instagramDMRepository.findAllThreads()
  }

  public async getThreadById(id: string): Promise<InstagramDMThread> {
    const thread = await this.instagramDMRepository.findThreadById(id)
    if (!thread) {
      throw new NotFoundException("DM Conversation thread not found.")
    }
    return thread
  }

  public async sendDM(threadId: string, text: string): Promise<InstagramDM> {
    const thread = await this.getThreadById(threadId)
    const reply: InstagramDM = {
      id: `ig-dm-reply-${Date.now()}`,
      senderUsername: "me",
      text,
      receivedAt: new Date(),
    }
    thread.messages.push(reply)
    thread.lastMessageAt = new Date()
    await this.instagramDMRepository.saveThread(thread)
    return reply
  }

  public async loadMockThreads(): Promise<InstagramDMThread[]> {
    const mocks: InstagramDMThread[] = [
      {
        id: "ig-th-1",
        participantUsername: "buyer_lead_prospect",
        lastMessageAt: new Date(),
        messages: [
          {
            id: "ig-dm-1",
            senderUsername: "buyer_lead_prospect",
            text: "Hello, what are your agency marketing pricing plans?",
            receivedAt: new Date(),
          },
        ],
      },
    ]
    return this.instagramDMRepository.saveAllThreads(mocks)
  }
}
