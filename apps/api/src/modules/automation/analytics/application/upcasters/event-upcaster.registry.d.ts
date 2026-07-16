import { IEventUpcaster } from '../../domain/ports/event-upcaster.interface';
export declare class EventUpcasterRegistry {
    private readonly registeredUpcasters;
    private upcasters;
    constructor(registeredUpcasters?: IEventUpcaster[]);
    upcast(provider: string, eventName: string, event: any, currentVersion: string, targetVersion: string): any;
}
