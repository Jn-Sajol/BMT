import { Injectable, NotFoundException } from "@nestjs/common"
import { CommentTemplateRepository } from "../../infrastructure/comment-template.repository"
import { CommentTemplate } from "../../domain/comment-template.model"

@Injectable()
export class CommentLibraryService {
  constructor(private readonly commentTemplateRepository: CommentTemplateRepository) {}

  public async getTemplates(): Promise<CommentTemplate[]> {
    return this.commentTemplateRepository.findAll()
  }

  public async addTemplate(
    content: string,
    category: string,
    tags: string[],
    language: string,
    createdBy: string
  ): Promise<CommentTemplate> {
    const template: CommentTemplate = {
      id: `ctemp-${Date.now()}`,
      content,
      category,
      tags,
      language,
      status: "Active",
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return this.commentTemplateRepository.save(template)
  }

  public async updateTemplate(id: string, updates: Partial<CommentTemplate>): Promise<CommentTemplate> {
    const template = await this.commentTemplateRepository.findById(id)
    if (!template) {
      throw new NotFoundException("Comment template not found to update.")
    }
    Object.assign(template, updates)
    template.updatedAt = new Date()
    return this.commentTemplateRepository.save(template)
  }

  public async deleteTemplate(id: string): Promise<void> {
    await this.commentTemplateRepository.remove(id)
  }
}
