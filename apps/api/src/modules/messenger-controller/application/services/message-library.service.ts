import { Injectable, NotFoundException } from "@nestjs/common"
import { MessageTemplateRepository } from "../../infrastructure/message-template.repository"
import { MessageTemplate } from "../../domain/message-template.model"

@Injectable()
export class MessageLibraryService {
  constructor(private readonly messageTemplateRepository: MessageTemplateRepository) {}

  public async getTemplates(): Promise<MessageTemplate[]> {
    return this.messageTemplateRepository.findAll()
  }

  public async addTemplate(content: string, category: string, tags: string[], language: string): Promise<MessageTemplate> {
    const template: MessageTemplate = {
      id: `mtemp-${Date.now()}`,
      content,
      category,
      tags,
      language,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return this.messageTemplateRepository.save(template)
  }

  public async updateTemplate(id: string, updates: Partial<MessageTemplate>): Promise<MessageTemplate> {
    const template = await this.messageTemplateRepository.findById(id)
    if (!template) {
      throw new NotFoundException("Message template not found to update.")
    }
    Object.assign(template, updates)
    template.updatedAt = new Date()
    return this.messageTemplateRepository.save(template)
  }

  public async deleteTemplate(id: string): Promise<void> {
    await this.messageTemplateRepository.remove(id)
  }
}
