export interface DomainEvent {
    id: string;
    name: string;
    workspaceId: string;
    payload: {
        entityId: string;
        [key: string]: any;
    };
    triggerVersion: string;
    eventVersion?: string;
    provider?: string;
    source: string;
    correlationId: string;
    causationId: string;
    occurredAt: Date;
    receivedAt: Date;
    processedAt: Date;
    timestamp: Date;
}
