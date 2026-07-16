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
exports.DeadLetterStoreService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let DeadLetterStoreService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var DeadLetterStoreService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            DeadLetterStoreService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        eventBus;
        retryQueue;
        constructor(prisma, eventBus, retryQueue) {
            this.prisma = prisma;
            this.eventBus = eventBus;
            this.retryQueue = retryQueue;
        }
        async storeDeadLetter(workspaceId, provider, eventName, payload, correlationId, causationId, reason, retryCount) {
            const record = await this.prisma.automationDeadLetter.create({
                data: {
                    workspaceId,
                    provider,
                    eventName,
                    payload: payload || {},
                    correlationId,
                    causationId,
                    reason,
                    retryCount,
                },
            });
            await this.publishEvent('Dead Letter Created', workspaceId, correlationId, {
                deadLetterId: record.id,
                reason,
            });
            return record.id;
        }
        async replayDeadLetter(id) {
            const record = await this.prisma.automationDeadLetter.findUnique({
                where: { id },
            });
            if (!record) {
                throw new common_1.NotFoundException(`Dead letter record ${id} not found.`);
            }
            await this.retryQueue.enqueue({
                correlationId: record.correlationId,
                workspaceId: record.workspaceId,
                provider: record.provider,
                providerAccountId: record.payload?.providerAccountId || 'default',
                executionId: record.causationId,
                actionId: record.payload?.actionId || undefined,
                retryCount: 0,
                maxRetries: 5,
                firstFailureAt: new Date(),
                lastFailureAt: new Date(),
                retryPolicy: 'EXPONENTIAL',
                payload: record.payload,
            }, 'HIGH');
            await this.publishEvent('Dead Letter Replayed', record.workspaceId, record.correlationId, {
                deadLetterId: record.id,
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
                source: 'Dead Letter Store',
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
    return DeadLetterStoreService = _classThis;
})();
exports.DeadLetterStoreService = DeadLetterStoreService;
//# sourceMappingURL=dead-letter-store.service.js.map