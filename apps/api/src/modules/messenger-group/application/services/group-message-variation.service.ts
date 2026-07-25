import { Injectable } from "@nestjs/common"

@Injectable()
export class GroupMessageVariationService {
  private greetings: string[] = ["Hello everyone!", "Hi members!", "Greetings all!", "Dear members,", "Hey everyone!"]
  private emojis: string[] = [" 😊", " 🎉", " 📢", " ✨", " 👍", ""]
  private synonymMap: Record<string, string[]> = {
    discount: ["special offer", "price drop", "deal"],
    items: ["products", "goods", "stock"],
    support: ["helpdesk", "assistance", "support team"],
    check: ["view", "see", "explore"]
  }

  public generateVariation(baseMessage: string): string {
    let result = baseMessage.trim()

    // 1. Greeting variation
    for (const g of this.greetings) {
      if (result.toLowerCase().startsWith("hello") || result.toLowerCase().startsWith("hi") || result.toLowerCase().startsWith("greetings")) {
        const randomIndex = Math.floor(Math.random() * this.greetings.length)
        result = result.replace(/^(hello|hi|greetings)[^,.!]*/i, this.greetings[randomIndex])
        break
      }
    }

    // 2. Synonym replacement
    for (const [word, synonyms] of Object.entries(this.synonymMap)) {
      const regex = new RegExp(`\\b${word}\\b`, "gi")
      if (regex.test(result)) {
        const randomSynonym = synonyms[Math.floor(Math.random() * synonyms.length)]
        result = result.replace(regex, randomSynonym)
      }
    }

    // 3. Punctuation variation
    if (result.endsWith(".")) {
      result = Math.random() > 0.5 ? result.slice(0, -1) + "!" : result
    }

    // 4. Emoji variation
    const randomEmoji = this.emojis[Math.floor(Math.random() * this.emojis.length)]
    result = `${result}${randomEmoji}`

    // 5. Spacing variation (trim double spaces)
    return result.replace(/\s+/g, " ").trim()
  }
}
