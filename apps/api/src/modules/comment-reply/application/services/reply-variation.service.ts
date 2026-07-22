import { Injectable } from "@nestjs/common"

@Injectable()
export class ReplyVariationService {
  private greetings = ["Hello!", "Hi there!", "Hey!", "Greetings!"]
  private closings = ["Thanks!", "Best regards,", "Have a great day!", "Cheers!"]
  private emojis = ["😊", "👍", "🙏", "✨", "😃"]

  private synonymMap: Record<string, string[]> = {
    thanks: ["thank you", "many thanks", "appreciate it"],
    help: ["assist", "support", "guide"],
    price: ["cost", "rate", "pricing"],
    details: ["info", "information", "particulars"]
  }

  public generateVariations(baseReply: string): string[] {
    if (!baseReply) return []
    const variations: string[] = []

    // 1. Original
    variations.push(baseReply)

    // 2. Add random greeting & closing
    const greeting = this.greetings[Math.floor(Math.random() * this.greetings.length)]
    const closing = this.closings[Math.floor(Math.random() * this.closings.length)]
    const emoji = this.emojis[Math.floor(Math.random() * this.emojis.length)]

    variations.push(`${greeting} ${baseReply} ${closing} ${emoji}`)

    // 3. Synonym replaced or polite variation with emoji
    let synonymVersion = baseReply
    for (const [word, synonyms] of Object.entries(this.synonymMap)) {
      if (new RegExp(`\\b${word}\\b`, "i").test(synonymVersion)) {
        const replacement = synonyms[Math.floor(Math.random() * synonyms.length)]
        synonymVersion = synonymVersion.replace(new RegExp(`\\b${word}\\b`, "gi"), replacement)
      }
    }
    if (synonymVersion !== baseReply) {
      variations.push(`${synonymVersion} ${emoji}`)
    } else {
      variations.push(`${baseReply} ${emoji}`)
    }

    return Array.from(new Set(variations))
  }
}
