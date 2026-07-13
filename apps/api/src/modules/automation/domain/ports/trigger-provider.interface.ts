import { DomainEvent } from '../models/domain-event.model';

export interface ITriggerProvider {
  providerName: string;
  supports(source: string): boolean;
  normalize(
    rawPayload: any,
    metadata: {
      workspaceId: string;
      correlationId: string;
      causationId: string;
      source: string;
      receivedAt: Date;
    },
  ): Promise<DomainEvent[]>;
}
