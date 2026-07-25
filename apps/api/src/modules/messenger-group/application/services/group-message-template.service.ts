import { Injectable } from "@nestjs/common"

export interface GroupMessageTemplate {
  id: string
  title: string
  content: string
  category: string
  lastUsedAt?: Date
  useCount: number
}

@Injectable()
export class GroupMessageTemplateService {
  private templates: Map<string, GroupMessageTemplate> = new Map()

  constructor() {
    // Populate default group message templates
    this.addTemplate({ title: "Sales Deal Promo", content: "Hello everyone! Check out our exclusive discount offer today.", category: "SALES" })
    this.addTemplate({ title: "Buy Sell Announcement", content: "Hi members! Fresh items available in stock with home delivery.", category: "BUY_SELL" })
    this.addTemplate({ title: "Support Update", content: "Hello team! Our support desk is open 24/7 for any questions.", category: "SUPPORT" })
    this.addTemplate({ title: "Community Hello", content: "Greeting members! Wish everyone a productive week ahead.", category: "COMMUNITY" })
  }

  public addTemplate(payload: { title: string; content: string; category: string }): GroupMessageTemplate {
    const template: GroupMessageTemplate = {
      id: `tmpl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: payload.title,
      content: payload.content,
      category: payload.category.toUpperCase(),
      useCount: 0
    }
    this.templates.set(template.id, template)
    return template
  }

  public selectTemplateForCampaign(category: string): GroupMessageTemplate {
    const cat = category.toUpperCase()
    let eligible = Array.from(this.templates.values()).filter((t) => t.category === cat)

    if (eligible.length === 0) {
      eligible = Array.from(this.templates.values())
    }

    // Sort by lastUsedAt ascending (avoid recently used templates for rotation)
    eligible.sort((a, b) => {
      const timeA = a.lastUsedAt ? a.lastUsedAt.getTime() : 0
      const timeB = b.lastUsedAt ? b.lastUsedAt.getTime() : 0
      return timeA - timeB
    })

    const selected = eligible[0]
    selected.lastUsedAt = new Date()
    selected.useCount += 1
    return selected
  }

  public getAllTemplates(): GroupMessageTemplate[] {
    return Array.from(this.templates.values())
  }
}
