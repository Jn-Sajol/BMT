export interface IWebhookHandler {
  supports(provider: string, eventType: string): boolean;
  handle(payload: any): Promise<void>;
}
