export interface IGroupHunterStrategy {
  performDiscoverySearch(keyword: string, country: string, language: string): Promise<any[]>
}

export class SafeGroupHunterStrategy implements IGroupHunterStrategy {
  public async performDiscoverySearch(keyword: string, country: string, language: string): Promise<any[]> {
    console.log(`[SafeGroupHunterStrategy] Pulling mock Graph search API data for keyword: ${keyword}...`)
    return []
  }
}

export class AdvancedGroupDiscoveryStrategy implements IGroupHunterStrategy {
  public async performDiscoverySearch(keyword: string, country: string, language: string): Promise<any[]> {
    console.log(`[AdvancedGroupDiscoveryStrategy] Running background browser search crawl routines...`)
    return []
  }
}
