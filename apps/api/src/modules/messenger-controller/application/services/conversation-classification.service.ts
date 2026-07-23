import { Injectable } from "@nestjs/common"

export type ConversationCategory = "SALES" | "LEAD" | "SUPPORT" | "GENERAL" | "UNKNOWN"
export type ConversationPriority = "HIGH" | "MEDIUM" | "LOW"

export interface ClassificationResult {
  category: ConversationCategory
  language: string
  priority: ConversationPriority
  isUnread: boolean
}

@Injectable()
export class ConversationClassificationService {
  public classifyConversation(
    text: string,
    isUnread: boolean = true
  ): ClassificationResult {
    if (!text) {
      return {
        category: "UNKNOWN",
        language: "English",
        priority: "LOW",
        isUnread
      }
    }

    const lower = text.toLowerCase()

    // 1. Category Classification (Rule-based)
    let category: ConversationCategory = "GENERAL"
    if (/help|support|issue|problem|error|broken|refund|complaint|not working|fix/i.test(lower)) {
      category = "SUPPORT"
    } else if (/price|cost|how much|buy|order|purchase|discount|payment|dam|koto|taka|bdt/i.test(lower)) {
      category = "SALES"
    } else if (/interested|quote|demo|contact|phone|number|email|details|info/i.test(lower)) {
      category = "LEAD"
    } else if (/hello|hi|hey|greetings|thanks|thank you/i.test(lower)) {
      category = "GENERAL"
    } else if (text.trim().length < 3) {
      category = "UNKNOWN"
    }

    // 2. Language Detection (Rule-based)
    const language = this.detectLanguage(text)

    // 3. Priority Assignment (Rule-based)
    let priority: ConversationPriority = "LOW"
    if (category === "SALES" || category === "SUPPORT" || /urgent|asap|immediately/i.test(lower)) {
      priority = "HIGH"
    } else if (category === "LEAD" || isUnread) {
      priority = "MEDIUM"
    }

    return {
      category,
      language,
      priority,
      isUnread
    }
  }

  public detectLanguage(text: string): string {
    if (!text) return "English"
    // Bengali Unicode Range \u0980-\u09FF or common transliterated words
    if (/[\u0980-\u09FF]/.test(text) || /\b(koto|dam|kamne|bhai|apni|taka)\b/i.test(text)) {
      return "Bengali"
    }
    // Spanish common words
    if (/\b(hola|gracias|cuanto|por favor|buenos)\b/i.test(text)) {
      return "Spanish"
    }
    // French common words
    if (/\b(bonjour|merci|combien|s'il vous plait)\b/i.test(text)) {
      return "French"
    }
    return "English"
  }
}
