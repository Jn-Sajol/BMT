import { DomainEvent } from '../../../domain/models/domain-event.model';
export interface IAnalyticsStore {
    appendEvent(event: DomainEvent): Promise<void>;
    getEvents(workspaceId: string): Promise<DomainEvent[]>;
    rebuildProjections(workspaceId: string): Promise<void>;
}
