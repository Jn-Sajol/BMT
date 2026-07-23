import { Injectable } from "@nestjs/common"

@Injectable()
export class FallbackReplyService {
  private fallbackReplies: string[] = [
    "Thank you for contacting us! We'll get back to you shortly.",
    "Hello! Our team has received your message and will respond as soon as possible.",
    "Thank you for reaching out! A representative will assist you in a moment."
  ]

  public getFallbackReply(confidence: number, minConfidenceThreshold: number = 0.7): { isFallbackUsed: boolean; replyText: string } {
    if (confidence >= minConfidenceThreshold) {
      return { isFallbackUsed: false, replyText: "" }
    }

    const randomIndex = Math.floor(Math.random() * this.fallbackReplies.length)
    return {
      isFallbackUsed: true,
      replyText: this.fallbackReplies[randomIndex]
    }
  }
}
