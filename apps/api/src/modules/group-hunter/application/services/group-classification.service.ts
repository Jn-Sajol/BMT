import { Injectable } from "@nestjs/common"

export interface GroupClassificationResult {
  category: "E-Commerce" | "Real Estate" | "Tech & Software" | "Jobs & Careers" | "General"
  language: "English" | "Bengali" | "Spanish" | "Other"
  privacy: "PUBLIC" | "PRIVATE"
  groupType: "BUY_SELL" | "GENERAL"
}

@Injectable()
export class GroupClassificationService {
  public classifyGroup(name: string, description: string = "", privacyInput: string = "PUBLIC"): GroupClassificationResult {
    const text = `${name} ${description}`.toLowerCase()

    // 1. Category detection
    let category: GroupClassificationResult["category"] = "General"
    if (text.includes("buy") || text.includes("sell") || text.includes("shop") || text.includes("market") || text.includes("bazar")) {
      category = "E-Commerce"
    } else if (text.includes("flat") || text.includes("rent") || text.includes("apartment") || text.includes("property") || text.includes("land")) {
      category = "Real Estate"
    } else if (text.includes("code") || text.includes("dev") || text.includes("tech") || text.includes("software") || text.includes("ai")) {
      category = "Tech & Software"
    } else if (text.includes("job") || text.includes("hiring") || text.includes("career") || text.includes("vacancy")) {
      category = "Jobs & Careers"
    }

    // 2. Language classification
    let language: GroupClassificationResult["language"] = "English"
    if (/[\u0980-\u09FF]/.test(text)) {
      language = "Bengali"
    } else if (text.includes("ventas") || text.includes("compras") || text.includes("grupo")) {
      language = "Spanish"
    }

    // 3. Privacy classification
    const privacy: GroupClassificationResult["privacy"] = privacyInput.toUpperCase() === "PRIVATE" ? "PRIVATE" : "PUBLIC"

    // 4. Marketplace/Group type classification
    const groupType: GroupClassificationResult["groupType"] = category === "E-Commerce" || text.includes("marketplace") || text.includes("buy and sell") ? "BUY_SELL" : "GENERAL"

    return {
      category,
      language,
      privacy,
      groupType
    }
  }
}
