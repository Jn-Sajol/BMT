import { Injectable } from '@nestjs/common';
import { IEventBus } from '../../application/ports/event-bus.interface';
import { DomainEvent } from '../../domain/models/domain-event.model';

@Injectable()
export class InMemoryEventBus implements IEventBus {
  private handlers = new Map<string, Array<(event: DomainEvent) => Promise<void>>>();

  async publish(event: DomainEvent): Promise<void> {
    const subscribers = this.handlers.get(event.name) || [];
    const wildcardSubscribers = this.handlers.get('*') || [];

    const all = [...subscribers, ...wildcardSubscribers];
    await Promise.all(all.map((handler) => handler(event)));
  }

  subscribe(eventName: string, handler: (event: DomainEvent) => Promise<void>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
  }
}
