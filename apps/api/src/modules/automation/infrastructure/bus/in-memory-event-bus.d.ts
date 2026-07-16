import { IEventBus } from '../../application/ports/event-bus.interface';
import { DomainEvent } from '../../domain/models/domain-event.model';
export declare class InMemoryEventBus implements IEventBus {
    private handlers;
    publish(event: DomainEvent): Promise<void>;
    subscribe(eventName: string, handler: (event: DomainEvent) => Promise<void>): void;
}
