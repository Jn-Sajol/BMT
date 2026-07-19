import { Injectable } from "@nestjs/common"
import { CommentTemplate } from "../domain/comment-template.model"

@Injectable()
export class CommentTemplateRepository {
  private templates: CommentTemplate[] = []

  public async save(template: CommentTemplate): Promise<CommentTemplate> {
    const idx = this.templates.findIndex((t) => t.id === template.id)
    if (idx >= 0) {
      this.templates[idx] = template
    } else {
      this.templates.push(template)
    }
    return template
  }

  public async findById(id: string): Promise<CommentTemplate | null> {
    return this.templates.find((t) => t.id === id) || null
  }

  public async findAll(): Promise<CommentTemplate[]> {
    return this.templates
  }

  public async remove(id: string): Promise<void> {
    this.templates = this.templates.filter((t) => t.id !== id)
  }
}
