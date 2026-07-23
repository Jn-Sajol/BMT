import { Injectable } from "@nestjs/common"

export type MessengerReplyMode = "Sales Conversion" | "Lead Conversion" | "Visit Conversion"

@Injectable()
export class ConversationReplyModeService {
  public formatReplyByMode(baseReply: string, mode: MessengerReplyMode): string {
    const trimmed = baseReply.trim()

    switch (mode) {
      case "Sales Conversion":
        return `${trimmed} Buy now to get 10% instant discount on your order!`
      case "Lead Conversion":
        return `${trimmed} Could you please share your email and contact number so our team can guide you?`
      case "Visit Conversion":
        return `${trimmed} Would you like to schedule an appointment or visit our outlet tomorrow at 11:00 AM?`
      default:
        return trimmed
    }
  }
}
