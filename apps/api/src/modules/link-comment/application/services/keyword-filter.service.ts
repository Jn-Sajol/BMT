import { Injectable } from "@nestjs/common"
import { ModerationSettings } from "../../domain/link-comment.model"

@Injectable()
export class KeywordFilterService {
  private settings: ModerationSettings = {
    blockedKeywords: ["buy now", "discount", "free offer"],
    allowedKeywords: ["support", "doc"],
    blockedDomains: ["malicious-spam-url.ru", "phishing-link.org"],
  }

  public async getSettings(): Promise<ModerationSettings> {
    return this.settings
  }

  public async updateBlockedKeywords(words: string[]): Promise<ModerationSettings> {
    this.settings.blockedKeywords = words
    return this.settings
  }

  public async updateBlockedDomains(domains: string[]): Promise<ModerationSettings> {
    this.settings.blockedDomains = domains
    return this.settings
  }
}
