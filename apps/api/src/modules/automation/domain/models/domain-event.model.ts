export interface DomainEvent {
  id: string; // event UUID
  name: string; // e.g., 'Campaign Published', 'Insights Synced', etc.
  workspaceId: string;
  payload: {
    entityId: string; // target campaign, adset, or ad ID
    [key: string]: any; // metrics or attributes
  };
  triggerVersion: string;
  eventVersion?: string;
  provider?: string;
  source: string; // Webhook, Scheduler, Insights Sync, Status Sync, Manual
  correlationId: string;
  causationId: string;
  occurredAt: Date;
  receivedAt: Date;
  processedAt: Date;
  timestamp: Date;
}
