"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryQueueService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let RetryQueueService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RetryQueueService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RetryQueueService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        eventBus;
        constructor(prisma, eventBus) {
            this.prisma = prisma;
            this.eventBus = eventBus;
        }
        async enqueue(context, priority = 'NORMAL') {
            const actionIdStr = context.actionId || 'noaction';
            const idempotencyKey = (0, crypto_1.createHash)('sha256')
                .update(`${context.correlationId}_${actionIdStr}_${context.retryCount}`)
                .digest('hex');
            const exists = await this.prisma.automationRetryQueue.findUnique({
                where: { idempotencyKey },
            });
            if (exists) {
                return;
            }
            try {
                await this.prisma.automationRetryQueue.create({
                    data: {
                        workspaceId: context.workspaceId,
                        provider: context.provider,
                        providerAccountId: context.providerAccountId,
                        eventName: 'Retry Scheduled',
                        payload: context.payload || {},
                        correlationId: context.correlationId,
                        causationId: context.executionId || (0, crypto_1.randomUUID)(),
                        actionId: context.actionId || null,
                        retryCount: context.retryCount,
                        maxRetries: context.maxRetries,
                        nextRetryAt: context.nextRetryAt || new Date(),
                        status: 'PENDING',
                        priority,
                        idempotencyKey,
                    },
                });
                await this.publishEvent('Retry Scheduled', context.workspaceId, context.correlationId, {
                    correlationId: context.correlationId,
                    idempotencyKey,
                    attempt: context.retryCount,
                });
            }
            catch (err) {
                if (err.code === 'P2002') {
                    return;
                }
                throw err;
            }
        }
        async dequeueNext() {
            const now = new Date();
            const pending = await this.prisma.automationRetryQueue.findMany({
                where: {
                    status: 'PENDING',
                    nextRetryAt: { lte: now },
                },
                orderBy: [
                    { nextRetryAt: 'asc' },
                    { createdAt: 'asc' },
                ],
                take: 20,
            });
            if (pending.length === 0) {
                return undefined;
            }
            const priorityWeight = (p) => (p === 'HIGH' ? 3 : p === 'LOW' ? 1 : 2);
            pending.sort((a, b) => {
                const timeDiff = a.nextRetryAt.getTime() - b.nextRetryAt.getTime();
                if (Math.abs(timeDiff) > 1000) {
                    return timeDiff;
                }
                return priorityWeight(b.priority) - priorityWeight(a.priority);
            });
            const target = pending[0];
            const updated = await this.prisma.automationRetryQueue.updateMany({
                where: {
                    id: target.id,
                    status: 'PENDING',
                },
                data: {
                    status: 'RUNNING',
                },
            });
            if (updated.count === 0) {
                return this.dequeueNext();
            }
            await this.publishEvent('Retry Started', target.workspaceId, target.correlationId, {
                correlationId: target.correlationId,
                idempotencyKey: target.idempotencyKey,
                attempt: target.retryCount,
            });
            return {
                correlationId: target.correlationId,
                workspaceId: target.workspaceId,
                provider: target.provider,
                providerAccountId: target.providerAccountId,
                executionId: target.causationId,
                actionId: target.actionId || undefined,
                retryCount: target.retryCount,
                maxRetries: target.maxRetries,
                firstFailureAt: target.createdAt,
                lastFailureAt: target.updatedAt,
                nextRetryAt: target.nextRetryAt,
                retryPolicy: 'RESOLVED',
                payload: target.payload,
            };
        }
        async completeRetry(idempotencyKey) {
            const item = await this.prisma.automationRetryQueue.findUnique({
                where: { idempotencyKey },
            });
            if (!item)
                return;
            await this.prisma.automationRetryQueue.update({
                where: { id: item.id },
                data: { status: 'COMPLETED' },
            });
            await this.publishEvent('Retry Completed', item.workspaceId, item.correlationId, {
                correlationId: item.correlationId,
                idempotencyKey,
            });
        }
        async failRetry(idempotencyKey, error) {
            const item = await this.prisma.automationRetryQueue.findUnique({
                where: { idempotencyKey },
            });
            if (!item)
                return;
            await this.prisma.automationRetryQueue.update({
                where: { id: item.id },
                data: { status: 'FAILED' },
            });
            await this.publishEvent('Retry Failed', item.workspaceId, item.correlationId, {
                correlationId: item.correlationId,
                idempotencyKey,
                error,
            });
        }
        async publishEvent(name, workspaceId, correlationId, payload) {
            const event = {
                id: (0, crypto_1.randomUUID)(),
                name,
                workspaceId,
                payload: {
                    entityId: correlationId,
                    ...payload,
                },
                triggerVersion: '1.0',
                source: 'Retry Queue',
                correlationId,
                causationId: (0, crypto_1.randomUUID)(),
                occurredAt: new Date(),
                receivedAt: new Date(),
                processedAt: new Date(),
                timestamp: new Date(),
            };
            await this.eventBus.publish(event);
        }
    };
    return RetryQueueService = _classThis;
})();
exports.RetryQueueService = RetryQueueService;
//# sourceMappingURL=retry-queue.service.js.map