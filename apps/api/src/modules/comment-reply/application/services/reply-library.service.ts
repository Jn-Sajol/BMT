import { Injectable, NotFoundException } from "@nestjs/common"
import { ReplyTemplateRepository } from "../../infrastructure/reply-template.repository"
import { ReplyTemplate } from "../../domain/reply-template.model"

@Injectable()
export class ReplyLibraryService {
  constructor(private readonly replyTemplateRepository: ReplyTemplateRepository) {}

  public async getTemplates(): Promise<ReplyTemplate[]> {
    return this.replyTemplateRepository.findAll()
  }

  public async addTemplate(content: string, category: string, tags: string[], language: string): Promise<ReplyTemplate> {
    const template: ReplyTemplate = {
      id: `rtemp-${Date.now()}`,
      content,
      category,
      tags,
      language,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return this.replyTemplateRepository.save(template)
  }

  public async updateTemplate(id: string, updates: Partial<ReplyTemplate>): Promise<ReplyTemplate> {
    const template = await this.replyTemplateRepository.findById(id)
    if (!template) {
      throw new NotFoundException("Reply template not found to update.")
    }
    Object.assign(template, updates)
    template.updatedAt = new Date()
    return this.replyTemplateRepository.save(template)
  }

  public async deleteTemplate(id: string): Promise<void> {
    await this.replyTemplateRepository.remove(id)
  }
}
