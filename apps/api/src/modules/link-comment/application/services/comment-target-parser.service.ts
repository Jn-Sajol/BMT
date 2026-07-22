import { Injectable, BadRequestException } from "@nestjs/common"

export type TargetClassification = "POST" | "GROUP_POST" | "PAGE_POST" | "MARKETPLACE_ITEM" | "UNKNOWN"

export interface NormalizedTargetPayload {
  targetId: string
  normalizedUrl: string
  classification: TargetClassification
  isValid: boolean
  isDuplicate: boolean
  parameters: Record<string, string>
}

@Injectable()
export class CommentTargetParserService {
  public normalizeUrl(rawUrl: string): string {
    if (!rawUrl) return ""
    let url = rawUrl.trim()
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`
    }
    try {
      const parsed = new URL(url)
      // Strip tracking query parameters
      parsed.searchParams.delete("fbclid")
      parsed.searchParams.delete("ref")
      return parsed.toString()
    } catch {
      return rawUrl.trim()
    }
  }

  public validateUrl(url: string): boolean {
    if (!url) return false
    return url.includes("facebook.com") || url.includes("fb.watch") || url.includes("fb.com")
  }

  public classifyTarget(normalizedUrl: string): TargetClassification {
    const lower = normalizedUrl.toLowerCase()
    if (lower.includes("/groups/") && (lower.includes("/posts/") || lower.includes("/permalink/"))) {
      return "GROUP_POST"
    } else if (lower.includes("/marketplace/item/")) {
      return "MARKETPLACE_ITEM"
    } else if (lower.includes("/pages/") || lower.includes("pfbid")) {
      return "PAGE_POST"
    } else if (lower.includes("/posts/") || lower.includes("/photos/") || lower.includes("/videos/")) {
      return "POST"
    }
    return "POST"
  }

  public prepareParserPayload(
    targetId: string,
    rawUrl: string,
    existingTargetIds: Set<string>
  ): NormalizedTargetPayload {
    const normalizedUrl = this.normalizeUrl(rawUrl)
    const isValid = this.validateUrl(normalizedUrl)
    if (!isValid) {
      throw new BadRequestException(`Target URL "${rawUrl}" is not a valid Facebook URL.`)
    }

    const isDuplicate = existingTargetIds.has(targetId)
    const classification = this.classifyTarget(normalizedUrl)

    return {
      targetId,
      normalizedUrl,
      classification,
      isValid,
      isDuplicate,
      parameters: {
        rawUrl,
        parsedAt: new Date().toISOString()
      }
    }
  }
}
