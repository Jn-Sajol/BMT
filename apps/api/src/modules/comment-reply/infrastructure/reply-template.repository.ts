import { Injectable } from "@nestjs/common"
import { ReplyTemplate } from "../domain/reply-template.model"

@Injectable()
export class ReplyTemplateRepository {
  private templates: ReplyTemplate[] = []

  public async save(template: ReplyTemplate): Promise<ReplyTemplate> {
    const idx = this.templates.findIndex((t) => t.id === template.id)
    if (idx >= 0) {
      this.templates[idx] = template
    } else {
      this.templates.push(template)
    }
    return template
  }

  public async findById(id: string): Promise<ReplyTemplate | null> {
    return this.templates.find((t) => t.id === id) || null
  }

  public async findAll(): Promise<ReplyTemplate[]> {
    return this.templates
  }

  public async remove(id: string): Promise<void> {
    this.templates = this.templates.filter((t) => t.id !== id)
  }
}
