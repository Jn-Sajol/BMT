import { Injectable } from "@nestjs/common"

export interface DetectionResult {
  hasLink: boolean
  isBlocked: boolean
  detectedUrls: string[]
  reason: string
}

@Injectable()
export class CommentLinkDetectionService {
  private readonly urlRegex = /(?:https?:\/\/|www\.)[^\s<]+|\b[a-zA-Z0-9-]+\.(?:com|org|net|io|co|ly|gl|gd|me|cc|gov|edu|info|biz|site|online)\b[^\s<]*/gi
  private readonly shortenedDomains = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "buff.ly", "ow.ly", "t.me"]

  public extractUrls(text: string): string[] {
    if (!text) return []
    const matches = text.match(this.urlRegex)
    if (!matches) return []
    const normalized = matches.map((u) => this.normalizeUrl(u))
    return Array.from(new Set(normalized))
  }

  public normalizeUrl(rawUrl: string): string {
    let url = rawUrl.trim().replace(/[.,;!?]+$/, "")
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`
    }
    try {
      const parsed = new URL(url)
      return parsed.hostname.toLowerCase() + parsed.pathname.replace(/\/$/, "")
    } catch {
      return url.toLowerCase()
    }
  }

  public isShortenedUrl(url: string): boolean {
    const lower = url.toLowerCase()
    return this.shortenedDomains.some((d) => lower.includes(d))
  }

  public evaluateComment(
    text: string,
    allowList: string[] = [],
    blockList: string[] = []
  ): DetectionResult {
    const urls = this.extractUrls(text)
    if (urls.length === 0) {
      return {
        hasLink: false,
        isBlocked: false,
        detectedUrls: [],
        reason: "No link detected"
      }
    }

    const normalizedAllow = allowList.map((a) => a.toLowerCase().trim())
    const normalizedBlock = blockList.map((b) => b.toLowerCase().trim())

    for (const url of urls) {
      // 1. Check Allow List match
      const isAllowed = normalizedAllow.some((allowed) => allowed && url.includes(allowed))
      if (isAllowed) {
        continue
      }

      // 2. Check Block List match
      const isExplicitlyBlocked = normalizedBlock.some((blocked) => blocked && url.includes(blocked))
      if (isExplicitlyBlocked) {
        return {
          hasLink: true,
          isBlocked: true,
          detectedUrls: urls,
          reason: `URL ${url} matches Block List rule`
        }
      }

      // 3. Shortened URL detection (auto-blocked)
      if (this.isShortenedUrl(url)) {
        return {
          hasLink: true,
          isBlocked: true,
          detectedUrls: urls,
          reason: `Shortened URL ${url} blocked by default link policy`
        }
      }

      // 4. Default policy: Any link not on Allow List is blocked
      return {
        hasLink: true,
        isBlocked: true,
        detectedUrls: urls,
        reason: `URL ${url} detected and not on Allow List`
      }
    }

    return {
      hasLink: true,
      isBlocked: false,
      detectedUrls: urls,
      reason: "All detected links match Allow List"
    }
  }
}
