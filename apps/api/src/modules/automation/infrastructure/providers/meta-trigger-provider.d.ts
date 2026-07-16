import { ITriggerProvider } from '../../domain/ports/trigger-provider.interface';
import { DomainEvent } from '../../domain/models/domain-event.model';
export declare class MetaTriggerProvider implements ITriggerProvider {
    providerName: string;
    supports(source: string): boolean;
    normalize(rawPayload: any, metadata: {
        workspaceId: string;
        correlationId: string;
        causationId: string;
        source: string;
        receivedAt: Date;
    }): Promise<DomainEvent[]>;
}
