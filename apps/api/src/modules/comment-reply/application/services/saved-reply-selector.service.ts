import { Injectable } from "@nestjs/common"

export interface SavedReplyTemplate {
  id: string
  category: string
  intent: string
  templateText: string
  weight: number
}

@Injectable()
export class SavedReplySelectorService {
  private templates: SavedReplyTemplate[] = [
    { id: "tpl-1", category: "General", intent: "Price", templateText: "Hello! Check your inbox for full pricing details.", weight: 5 },
    { id: "tpl-2", category: "General", intent: "Price", templateText: "Thanks for asking! Our prices start from $19. DM us for details.", weight: 3 },
    { id: "tpl-3", category: "General", intent: "Info", templateText: "Hi! Please visit our official website or message us for info.", weight: 5 },
    { id: "tpl-4", category: "General", intent: "Order", templateText: "Awesome! Please send us a direct message with your phone number.", weight: 5 },
    { id: "tpl-5", category: "General", intent: "Greeting", templateText: "Hello there! How can we assist you today?", weight: 4 },
    { id: "tpl-6", category: "General", intent: "General", templateText: "Thank you for reaching out to us!", weight: 3 }
  ]

  private recentlyUsedIds: Set<string> = new Set()

  public addTemplate(template: SavedReplyTemplate): void {
    this.templates.push(template)
  }

  public selectReply(intent: string, category: string = "General"): SavedReplyTemplate {
    // 1. Match category & intent
    let matched = this.templates.filter((t) => t.intent === intent && t.category === category)
    if (matched.length === 0) {
      matched = this.templates.filter((t) => t.intent === intent)
    }
    if (matched.length === 0) {
      matched = this.templates
    }

    // 2. Avoid recently used if possible
    const available = matched.filter((t) => !this.recentlyUsedIds.has(t.id))
    const pool = available.length > 0 ? available : matched

    // 3. Weighted random selection
    const totalWeight = pool.reduce((sum, t) => sum + t.weight, 0)
    let randomNum = Math.random() * totalWeight

    let selected = pool[0]
    for (const t of pool) {
      if (randomNum < t.weight) {
        selected = t
        break
      }
      randomNum -= t.weight
    }

    // 4. Update recently used rotation (keep last 3)
    this.recentlyUsedIds.add(selected.id)
    if (this.recentlyUsedIds.size > 3) {
      const first = Array.from(this.recentlyUsedIds)[0]
      this.recentlyUsedIds.delete(first)
    }

    return selected
  }
}
