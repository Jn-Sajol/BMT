import { Injectable } from "@nestjs/common"
import { DiscoveredGroupData } from "./group-discovery.service"

export interface GroupFilterCriteria {
  languages?: string[]
  countries?: string[]
  minMemberCount?: number
  maxMemberCount?: number
  privacy?: "PUBLIC" | "PRIVATE" | "ALL"
  category?: string
  keywords?: string[]
  activeWithinDays?: number
}

@Injectable()
export class GroupFilteringService {
  public filterGroups(groups: DiscoveredGroupData[], criteria: GroupFilterCriteria): DiscoveredGroupData[] {
    return groups.filter((g) => {
      // 1. Language filter
      if (criteria.languages && criteria.languages.length > 0) {
        if (!criteria.languages.some((l) => l.toLowerCase() === g.language.toLowerCase())) {
          return false
        }
      }

      // 2. Member count filter
      if (criteria.minMemberCount !== undefined && g.memberCount < criteria.minMemberCount) {
        return false
      }
      if (criteria.maxMemberCount !== undefined && g.memberCount > criteria.maxMemberCount) {
        return false
      }

      // 3. Privacy filter
      if (criteria.privacy && criteria.privacy !== "ALL") {
        if (g.privacy !== criteria.privacy) {
          return false
        }
      }

      // 4. Category filter
      if (criteria.category && criteria.category !== "ALL") {
        if (g.category.toLowerCase() !== criteria.category.toLowerCase()) {
          return false
        }
      }

      // 5. Keyword filter
      if (criteria.keywords && criteria.keywords.length > 0) {
        const combined = `${g.groupName} ${g.description}`.toLowerCase()
        const matches = criteria.keywords.some((kw) => combined.includes(kw.toLowerCase()))
        if (!matches) {
          return false
        }
      }

      // 6. Activity filter
      if (criteria.activeWithinDays !== undefined) {
        const elapsedDays = (Date.now() - g.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
        if (elapsedDays > criteria.activeWithinDays) {
          return false
        }
      }

      return true
    })
  }
}
