export interface IMessengerLinkStrategy {
  performLinkSearch(keyword: string, country: string, language: string): Promise<any[]>
}

export class SafeMessengerLinkStrategy implements IMessengerLinkStrategy {
  public async performLinkSearch(keyword: string, country: string, language: string): Promise<any[]> {
    console.log(`[SafeMessengerLinkStrategy] Querying official Page/Group invite links APIs for keyword: ${keyword}...`)
    return []
  }
}

export class AdvancedMessengerLinkAutomationStrategy implements IMessengerLinkStrategy {
  public async performLinkSearch(keyword: string, country: string, language: string): Promise<any[]> {
    console.log(`[AdvancedMessengerLinkAutomationStrategy] Running Playwright DOM parsers to harvest messenger links...`)
    return []
  }
}
