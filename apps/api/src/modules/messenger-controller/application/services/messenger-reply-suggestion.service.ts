import { Injectable } from "@nestjs/common"

export type MessengerIntent =
  | "price"
  | "order"
  | "availability"
  | "delivery"
  | "location"
  | "greeting"
  | "support"
  | "complaint"
  | "unknown"

export interface MessengerReplySuggestion {
  suggestedReply: string
  confidence: number
  detectedIntent: MessengerIntent
  detectedLanguage: string
}

@Injectable()
export class MessengerReplySuggestionService {
  public analyzeMessage(messageText: string): MessengerReplySuggestion {
    if (!messageText || messageText.trim().length === 0) {
      return {
        suggestedReply: "Hello! How can we help you today?",
        confidence: 0.5,
        detectedIntent: "unknown",
        detectedLanguage: "English"
      }
    }

    const lower = messageText.toLowerCase()
    const detectedLanguage = this.detectLanguage(messageText)

    // Rule-Based Intent Detection
    let detectedIntent: MessengerIntent = "unknown"
    let confidence = 0.8

    if (/complaint|bad|terrible|awful|disappointed|worst|scam|fraud/i.test(lower)) {
      detectedIntent = "complaint"
      confidence = 0.95
    } else if (/support|help|issue|problem|broken|error|not working|fix/i.test(lower)) {
      detectedIntent = "support"
      confidence = 0.9
    } else if (/price|cost|how much|dam|koto|taka|bdt|charge|rate/i.test(lower)) {
      detectedIntent = "price"
      confidence = 0.92
    } else if (/order|buy|purchase|confirm|want to get|take/i.test(lower)) {
      detectedIntent = "order"
      confidence = 0.91
    } else if (/available|stock|in stock|have this|ase/i.test(lower)) {
      detectedIntent = "availability"
      confidence = 0.88
    } else if (/delivery|shipping|courier|ship|cod|cash on delivery/i.test(lower)) {
      detectedIntent = "delivery"
      confidence = 0.89
    } else if (/location|address|where|shop|store|office|kothay/i.test(lower)) {
      detectedIntent = "location"
      confidence = 0.87
    } else if (/hello|hi|hey|greetings|assalamu|buenos|bonjour/i.test(lower)) {
      detectedIntent = "greeting"
      confidence = 0.85
    }

    // Generate Single Rule-Based Reply Suggestion
    const suggestedReply = this.generateRuleBasedReply(detectedIntent, detectedLanguage)

    return {
      suggestedReply,
      confidence,
      detectedIntent,
      detectedLanguage
    }
  }

  private detectLanguage(text: string): string {
    if (/[\u0980-\u09FF]/.test(text) || /\b(koto|dam|ase|kothay|apni|bhai)\b/i.test(text)) {
      return "Bengali"
    }
    if (/\b(hola|gracias|cuanto|donde)\b/i.test(text)) {
      return "Spanish"
    }
    if (/\b(bonjour|merci|combien|ou)\b/i.test(text)) {
      return "French"
    }
    return "English"
  }

  private generateRuleBasedReply(intent: MessengerIntent, language: string): string {
    if (language === "Bengali") {
      switch (intent) {
        case "price": return "ধন্যবাদ! আমাদের পণের বিস্তারিত মূল্য জানাতে ইনবক্সে মেসেজ করুন।"
        case "order": return "ধন্যবাদ! অর্ডার কনফার্ম করতে আপনার নাম ও ফোন নম্বর দিন।"
        case "availability": return "জি, পণ্যটি আমাদের স্টকে এভেলেবল আছে।"
        case "delivery": return "আমরা ক্যাশ অন ডেলিভারিতে ২-৩ দিনের মধ্যে ডেলিভারি দিই।"
        case "location": return "আমাদের শপ ঢাকা আউটলেটে অবস্থিত। বিস্তারিত জানতে মেসেজ দিন।"
        case "support": return "আপনার সমস্যার কথা জানান, আমাদের সাপোর্ট টিম দ্রুত সহায়তা করবে।"
        case "complaint": return "আন্তরিকভাবে দুঃখিত! দয়া করে আপনার অর্ডার আইডি ও সমস্যা জানান।"
        case "greeting": return "হ্যালো! আপনাকে কিভাবে সাহায্য করতে পারি?"
        default: return "ধন্যবাদ আমাদের সাথে যোগাযোগের জন্য! আপনাকে কিভাবে সাহায্য করতে পারি?"
      }
    }

    switch (intent) {
      case "price": return "Hello! Thanks for reaching out. Please check your inbox or message us for full pricing details."
      case "order": return "Thank you! To confirm your order, please reply with your full name, phone number, and address."
      case "availability": return "Hi! Yes, this item is currently in stock and ready to ship."
      case "delivery": return "We offer standard home delivery within 2-3 business days with Cash on Delivery."
      case "location": return "Our store and warehouse are located at Main Avenue Center. DM for directions."
      case "support": return "Hello! Please describe the issue you are experiencing, and our support team will assist you immediately."
      case "complaint": return "We sincerely apologize for the inconvenience! Please provide your order ID so we can resolve this right away."
      case "greeting": return "Hello there! How can we assist you today?"
      default: return "Thank you for reaching out to us! How can we help you today?"
    }
  }
}
