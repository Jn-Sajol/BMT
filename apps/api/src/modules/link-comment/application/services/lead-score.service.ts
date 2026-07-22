import { Injectable } from "@nestjs/common"

export interface LeadScoreFactors {
  keywordMatch: boolean
  isQuestion: boolean
  buyingIntent: boolean
  sellingIntent: boolean
  phoneDetected: boolean
  emailDetected: boolean
  locationDetected: boolean
  matchedKeywords: string[]
  contactHints: {
    phone?: string
    email?: string
  }
}

@Injectable()
export class LeadScoreService {
  public calculateScore(text: string, customKeywords: string[] = []): { score: number; factors: LeadScoreFactors } {
    if (!text) {
      return {
        score: 0,
        factors: {
          keywordMatch: false,
          isQuestion: false,
          buyingIntent: false,
          sellingIntent: false,
          phoneDetected: false,
          emailDetected: false,
          locationDetected: false,
          matchedKeywords: [],
          contactHints: {}
        }
      }
    }

    const lower = text.toLowerCase()
    let score = 0

    // 1. Keyword match
    const matchedKeywords: string[] = []
    for (const kw of customKeywords) {
      if (lower.includes(kw.toLowerCase())) {
        matchedKeywords.push(kw)
      }
    }
    const keywordMatch = matchedKeywords.length > 0
    if (keywordMatch) score += Math.min(30, matchedKeywords.length * 15)

    // 2. Question detection
    const isQuestion = text.includes("?") || /how much|price|cost|koto|dam/i.test(lower)
    if (isQuestion) score += 20

    // 3. Buying intent
    const buyingIntent = /buy|order|want|interested|need|inbox|dm|dam koto|lagbe/i.test(lower)
    if (buyingIntent) score += 25

    // 4. Selling intent
    const sellingIntent = /available|for sale|discount|offer|stock/i.test(lower)
    if (sellingIntent) score += 15

    // 5. Phone detection
    const phoneMatch = text.match(/(?:\+?88)?01[3-9]\d{8}/)
    const phoneDetected = !!phoneMatch
    const phone = phoneMatch ? phoneMatch[0] : undefined
    if (phoneDetected) score += 30

    // 6. Email detection
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    const emailDetected = !!emailMatch
    const email = emailMatch ? emailMatch[0] : undefined
    if (emailDetected) score += 30

    // 7. Location detection
    const locationDetected = /dhaka|chittagong|sylhet|rajshahi|khulna|barisal|rangpur|comilla|bogra/i.test(lower)
    if (locationDetected) score += 10

    // Cap score at 100
    const finalScore = Math.min(100, Math.max(0, score))

    return {
      score: finalScore,
      factors: {
        keywordMatch,
        isQuestion,
        buyingIntent,
        sellingIntent,
        phoneDetected,
        emailDetected,
        locationDetected,
        matchedKeywords,
        contactHints: {
          phone,
          email
        }
      }
    }
  }
}
