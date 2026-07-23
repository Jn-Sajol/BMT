import { Injectable } from "@nestjs/common"

export type SavedReplyCategory = "Sales" | "Support" | "Greeting" | "Delivery" | "Price" | "General"

export interface SavedReplyItem {
  id: string
  title: string
  content: string
  category: SavedReplyCategory
  isFavorite: boolean
  useCount: number
  createdAt: Date
}

@Injectable()
export class MessengerReplyLibraryService {
  private savedReplies: Map<string, SavedReplyItem> = new Map()

  constructor() {
    // Populate default library templates
    this.addSavedReply({ title: "Price Info", content: "Hello! Check your inbox for full pricing details.", category: "Price", isFavorite: true })
    this.addSavedReply({ title: "Order Confirmation", content: "Thank you! Please send us your full address and phone number.", category: "Sales", isFavorite: true })
    this.addSavedReply({ title: "Support Greeting", content: "Hello! Please describe your issue and our team will help you.", category: "Support", isFavorite: false })
    this.addSavedReply({ title: "Delivery Timeframe", content: "Our standard delivery takes 2-3 business days nationwide.", category: "Delivery", isFavorite: false })
    this.addSavedReply({ title: "General Thanks", content: "Thank you for reaching out to us! Have a great day.", category: "General", isFavorite: false })
  }

  public addSavedReply(payload: { title: string; content: string; category: SavedReplyCategory; isFavorite?: boolean }): SavedReplyItem {
    const item: SavedReplyItem = {
      id: `srep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: payload.title,
      content: payload.content,
      category: payload.category,
      isFavorite: payload.isFavorite || false,
      useCount: 0,
      createdAt: new Date()
    }
    this.savedReplies.set(item.id, item)
    return item
  }

  public searchReplies(query?: string, category?: SavedReplyCategory): SavedReplyItem[] {
    let list = Array.from(this.savedReplies.values())

    if (category) {
      list = list.filter((item) => item.category === category)
    }

    if (query && query.trim().length > 0) {
      const q = query.toLowerCase().trim()
      list = list.filter((item) => item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q))
    }

    return list
  }

  public getFavorites(): SavedReplyItem[] {
    return Array.from(this.savedReplies.values()).filter((item) => item.isFavorite)
  }

  public getMostUsed(limit: number = 5): SavedReplyItem[] {
    return Array.from(this.savedReplies.values())
      .sort((a, b) => b.useCount - a.useCount)
      .slice(0, limit)
  }

  public toggleFavorite(id: string): SavedReplyItem {
    const item = this.savedReplies.get(id)
    if (!item) throw new Error(`Saved reply ${id} not found`)
    item.isFavorite = !item.isFavorite
    return item
  }

  public incrementUseCount(id: string): void {
    const item = this.savedReplies.get(id)
    if (item) {
      item.useCount++
    }
  }

  public getAllReplies(): SavedReplyItem[] {
    return Array.from(this.savedReplies.values())
  }
}
