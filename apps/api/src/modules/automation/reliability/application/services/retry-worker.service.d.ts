import { OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { RetryQueueService } from './retry-queue.service';
import { IEventBus } from '../../../application/ports/event-bus.interface';
export declare class RetryWorker implements OnApplicationBootstrap, OnApplicationShutdown {
    private readonly queue;
    private readonly eventBus;
    private pollTimer?;
    private isShuttingDown;
    private workerId;
    constructor(queue: RetryQueueService, eventBus: IEventBus);
    onApplicationBootstrap(): void;
    onApplicationShutdown(): void;
    private processNextRetry;
    getWorkerId(): string;
}
