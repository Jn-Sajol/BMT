import { Injectable } from "@nestjs/common"

@Injectable()
export class TitleVariationService {
  public async generate(original: string): Promise<string> {
    console.log(`[AI Gateway] Generating variations for title: "${original}"`)
    return `🔥 NEW: ${original} - Best Price Guaranteed!`
  }
}

@Injectable()
export class DescriptionVariationService {
  public async generate(original: string): Promise<string> {
    console.log(`[AI Gateway] Generating variations for description: "${original}"`)
    return `${original}\n\n✅ Verified Seller\n✅ Fast Shipping Available`
  }
}

@Injectable()
export class CTAService {
  public async generate(): Promise<string> {
    return "DM now to secure yours before it sells out!"
  }
}

@Injectable()
export class EmojiVariationService {
  public async generate(original: string): Promise<string> {
    return `✨ 📦 ${original} 🏷️ ⚡`
  }
}

@Injectable()
export class HashtagService {
  public async generate(keywords: string[]): Promise<string[]> {
    return keywords.map(k => `#${k.toLowerCase()}`)
  }
}
