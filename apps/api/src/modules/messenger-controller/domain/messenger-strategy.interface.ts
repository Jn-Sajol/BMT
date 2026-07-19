export interface IMessengerStrategy {
  executeMessageFlow(inboxId: string, replyText: string): Promise<{ success: boolean; messageId: string }>
}

export class SafeMessengerStrategy implements IMessengerStrategy {
  public async executeMessageFlow(inboxId: string, replyText: string): Promise<{ success: boolean; messageId: string }> {
    console.log(`[SafeMessengerStrategy] Manual approved dispatch to messenger inbox: ${inboxId}...`)
    return { success: true, messageId: `msg-safe-m-${Date.now()}` }
  }
}

export class AdvancedMessengerAutomationStrategy implements IMessengerStrategy {
  public async executeMessageFlow(inboxId: string, replyText: string): Promise<{ success: boolean; messageId: string }> {
    console.log(`[AdvancedMessengerAutomationStrategy] Executing auto webhooks loop...`)
    return { success: true, messageId: `msg-adv-m-${Date.now()}` }
  }
}
