import { Injectable, Inject, Optional } from '@nestjs/common';
import { IEventUpcaster } from '../../domain/ports/event-upcaster.interface';

@Injectable()
export class EventUpcasterRegistry {
  private upcasters = new Map<string, Map<string, IEventUpcaster[]>>();

  constructor(
    @Optional()
    @Inject('EVENT_UPCASTERS')
    private readonly registeredUpcasters: IEventUpcaster[] = [],
  ) {
    for (const upcaster of this.registeredUpcasters) {
      const providerKey = upcaster.provider.toUpperCase();
      const eventKey = upcaster.targetEventName.toUpperCase();

      if (!this.upcasters.has(providerKey)) {
        this.upcasters.set(providerKey, new Map<string, IEventUpcaster[]>());
      }
      const eventMap = this.upcasters.get(providerKey)!;
      if (!eventMap.has(eventKey)) {
        eventMap.set(eventKey, []);
      }
      eventMap.get(eventKey)!.push(upcaster);
    }
  }

  upcast(
    provider: string,
    eventName: string,
    event: any,
    currentVersion: string,
    targetVersion: string,
  ): any {
    if (currentVersion === targetVersion) {
      return event;
    }

    const providerKey = provider.toUpperCase();
    const eventKey = eventName.toUpperCase();

    const eventMap = this.upcasters.get(providerKey);
    if (!eventMap) {
      return event;
    }

    const list = eventMap.get(eventKey) || [];

    let current = event;
    let version = currentVersion;

    let evolved = true;
    while (version !== targetVersion && evolved) {
      evolved = false;
      for (const upcaster of list) {
        if (upcaster.sourceVersion === version) {
          current = upcaster.upcast(current);
          version = upcaster.targetVersion;
          evolved = true;
          break;
        }
      }
    }

    return current;
  }
}
