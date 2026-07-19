export interface IReplyStrategy {
  executeReplyFlow(inboxId: string, replyText: string): Promise<{ success: boolean; messageId: string }>
}

export class SafeReplyStrategy implements IReplyStrategy {
  public async executeReplyFlow(inboxId: string, replyText: string): Promise<{ success: boolean; messageId: string }> {
    console.log(`[SafeReplyStrategy] Posting manually approved reply to comment inbox: ${inboxId}...`)
    return { success: true, messageId: `msg-safe-${Date.now()}` }
  }
}

export class AdvancedAutoReplyStrategy implements IReplyStrategy {
  public async executeReplyFlow(inboxId: string, replyText: string): Promise<{ success: boolean; messageId: string }> {
    console.log(`[AdvancedAutoReplyStrategy] Executing background webhook triggers...`)
    return { success: true, messageId: `msg-adv-${Date.now()}` }
  }
}
