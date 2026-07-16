import { CircuitBreakerService } from '../application/services/circuit-breaker.service';
import { DeadLetterStoreService } from '../application/services/dead-letter-store.service';
import { RetryQueueService } from '../application/services/retry-queue.service';
import { RetryWorker } from '../application/services/retry-worker.service';
import { ExtendedPrismaClient } from '../../../../infrastructure/database/prisma-extensions';
export declare class ReliabilityController {
    private readonly breaker;
    private readonly dlq;
    private readonly queue;
    private readonly worker;
    private readonly prisma;
    constructor(breaker: CircuitBreakerService, dlq: DeadLetterStoreService, queue: RetryQueueService, worker: RetryWorker, prisma: ExtendedPrismaClient);
    getRetryQueue(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        workspaceId: string;
        provider: string;
        idempotencyKey: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        correlationId: string;
        priority: string;
        causationId: string;
        eventName: string;
        retryCount: number;
        providerAccountId: string;
        actionId: string | null;
        maxRetries: number;
        nextRetryAt: Date;
    }[]>;
    getDeadLetters(req: any): Promise<{
        id: string;
        createdAt: Date;
        workspaceId: string;
        provider: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        correlationId: string;
        causationId: string;
        eventName: string;
        retryCount: number;
        reason: string;
    }[]>;
    getCircuitBreakers(req: any): Promise<{
        id: string;
        updatedAt: Date;
        status: string;
        workspaceId: string;
        provider: string;
        providerAccountId: string;
        failureCount: number;
        lastFailureAt: Date | null;
        nextAttemptAt: Date | null;
        recoveryTimeoutMs: number;
        failureThreshold: number;
    }[]>;
    triggerRetry(idempotencyKey: string): Promise<{
        success: boolean;
        reason: string;
    } | {
        success: boolean;
        reason?: undefined;
    }>;
    replayDeadLetter(deadLetterId: string): Promise<{
        success: boolean;
    }>;
    resetBreaker(provider: string, providerAccountId: string, req: any): Promise<{
        success: boolean;
    }>;
    checkHealth(req: any): Promise<{
        retryQueueDepth: number;
        deadLetterCount: number;
        oldestRetryAgeMs: number;
        circuitBreakers: {
            provider: string;
            status: string;
        }[];
        workerCount: number;
        averageProcessingRate: number;
        failureRate: number;
    }>;
}
