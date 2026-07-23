import { Injectable } from "@nestjs/common"

export type MessengerGroupCategory = "SALES" | "BUY_SELL" | "LOCAL" | "SUPPORT" | "COMMUNITY" | "UNKNOWN"
export type MessengerGroupPriority = "HIGH" | "MEDIUM" | "LOW"

export interface MessengerGroupClassificationResult {
  category: MessengerGroupCategory
  language: string
  priority: MessengerGroupPriority
}

@Injectable()
export class MessengerGroupClassificationService {
  public classifyGroup(groupName: string, lastMessage: string = ""): MessengerGroupClassificationResult {
    const combinedText = `${groupName} ${lastMessage}`.toLowerCase()

    // 1. Rule-Based Category Detection
    let category: MessengerGroupCategory = "COMMUNITY"

    if (/buy|sell|buy & sell|bazaar|market|shop|deal|discount|sale|dam|kinbo|bechbo/i.test(combinedText)) {
      category = "BUY_SELL"
    } else if (/support|help|service|issue|problem|customer|assist/i.test(combinedText)) {
      category = "SUPPORT"
    } else if (/sales|leads|order|client|business|marketing|promo/i.test(combinedText)) {
      category = "SALES"
    } else if (/local|dhaka|city|area|location|zone|neighborhood/i.test(combinedText)) {
      category = "LOCAL"
    } else if (/community|club|group|friends|family|members|discussion/i.test(combinedText)) {
      category = "COMMUNITY"
    } else if (combinedText.trim().length < 3) {
      category = "UNKNOWN"
    }

    // 2. Language Detection
    const language = this.detectLanguage(combinedText)

    // 3. Priority Assignment
    let priority: MessengerGroupPriority = "LOW"
    if (category === "BUY_SELL" || category === "SALES") {
      priority = "HIGH"
    } else if (category === "SUPPORT" || category === "LOCAL") {
      priority = "MEDIUM"
    }

    return {
      category,
      language,
      priority
    }
  }

  private detectLanguage(text: string): string {
    if (/[\u0980-\u09FF]/.test(text) || /\b(bhai|apni|dam|kinbo|koto|dhaka|bazaar)\b/i.test(text)) {
      return "Bangla"
    }
    if (/\b(hola|comprar|vender|grupo|gracias)\b/i.test(text)) {
      return "Spanish"
    }
    if (/\b(bonjour|groupe|achat|vente|merci)\b/i.test(text)) {
      return "French"
    }
    return "English"
  }
}
