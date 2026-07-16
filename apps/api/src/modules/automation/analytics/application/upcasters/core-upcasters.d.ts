import { IEventUpcaster } from '../../domain/ports/event-upcaster.interface';
export declare class TriggerMatchedUpcaster_1_0_to_2_0 implements IEventUpcaster {
    provider: string;
    targetEventName: string;
    sourceVersion: string;
    targetVersion: string;
    upcast(event: any): any;
}
