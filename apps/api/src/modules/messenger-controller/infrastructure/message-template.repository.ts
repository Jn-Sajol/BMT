import { Injectable } from "@nestjs/common"
import { MessageTemplate } from "../domain/message-template.model"

@Injectable()
export class MessageTemplateRepository {
  private templates: MessageTemplate[] = []

  public async save(template: MessageTemplate): Promise<MessageTemplate> {
    const idx = this.templates.findIndex((t) => t.id === template.id)
    if (idx >= 0) {
      this.templates[idx] = template
    } else {
      this.templates.push(template)
    }
    return template
  }

  public async findById(id: string): Promise<MessageTemplate | null> {
    return this.templates.find((t) => t.id === id) || null
  }

  public async findAll(): Promise<MessageTemplate[]> {
    return this.templates
  }

  public async remove(id: string): Promise<void> {
    this.templates = this.templates.filter((t) => t.id !== id)
  }
}
