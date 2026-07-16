import { OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { SchedulerEngine } from './scheduler-engine.service';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
export declare class SchedulerLoop implements OnApplicationBootstrap, OnApplicationShutdown {
    private readonly engine;
    private readonly prisma;
    private readonly nodeId;
    private heartbeatTimer?;
    private pollTimer?;
    private isShuttingDown;
    constructor(engine: SchedulerEngine, prisma: ExtendedPrismaClient);
    onApplicationBootstrap(): Promise<void>;
    onApplicationShutdown(): Promise<void>;
    private sendHeartbeat;
    private pollSchedules;
    getNodeId(): string;
}
