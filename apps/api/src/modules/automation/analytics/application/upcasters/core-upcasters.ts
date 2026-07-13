import { Injectable } from '@nestjs/common';
import { IEventUpcaster } from '../../domain/ports/event-upcaster.interface';

@Injectable()
export class TriggerMatchedUpcaster_1_0_to_2_0 implements IEventUpcaster {
  provider = 'Meta';
  targetEventName = 'Trigger Matched';
  sourceVersion = '1.0';
  targetVersion = '2.0';

  upcast(event: any): any {
    return {
      ...event,
      payload: {
        ...event.payload,
        upcasted: true,
        schemaEvolution: 'Applied 1.0 -> 2.0 conversion',
      },
    };
  }
}
