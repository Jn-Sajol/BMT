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
exports.CircuitBreakerService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let CircuitBreakerService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CircuitBreakerService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CircuitBreakerService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        eventBus;
        constructor(prisma, eventBus) {
            this.prisma = prisma;
            this.eventBus = eventBus;
        }
        async checkCallAllowed(provider, accountId, workspaceId) {
            const breaker = await this.getOrCreateBreaker(provider, accountId, workspaceId);
            if (breaker.status === 'CLOSED') {
                return true;
            }
            if (breaker.status === 'OPEN') {
                const now = new Date();
                if (breaker.nextAttemptAt && breaker.nextAttemptAt <= now) {
                    await this.prisma.automationCircuitBreaker.update({
                        where: { id: breaker.id },
                        data: { status: 'HALF_OPEN' },
                    });
                    await this.publishEvent('Circuit Breaker Half Open', workspaceId, breaker.id, { provider, accountId });
                    return true;
                }
                return false;
            }
            return true;
        }
        async recordSuccess(provider, accountId, workspaceId) {
            const breaker = await this.getOrCreateBreaker(provider, accountId, workspaceId);
            if (breaker.status !== 'CLOSED') {
                await this.prisma.automationCircuitBreaker.update({
                    where: { id: breaker.id },
                    data: {
                        status: 'CLOSED',
                        failureCount: 0,
                        nextAttemptAt: null,
                    },
                });
                await this.publishEvent('Circuit Breaker Closed', workspaceId, breaker.id, { provider, accountId });
            }
        }
        async recordFailure(provider, accountId, workspaceId) {
            const breaker = await this.getOrCreateBreaker(provider, accountId, workspaceId);
            const newFailCount = breaker.failureCount + 1;
            if (newFailCount >= breaker.failureThreshold) {
                const now = new Date();
                const nextAttempt = new Date(now.getTime() + breaker.recoveryTimeoutMs);
                await this.prisma.automationCircuitBreaker.update({
                    where: { id: breaker.id },
                    data: {
                        status: 'OPEN',
                        failureCount: newFailCount,
                        lastFailureAt: now,
                        nextAttemptAt: nextAttempt,
                    },
                });
                await this.publishEvent('Circuit Breaker Opened', workspaceId, breaker.id, { provider, accountId, nextAttemptAt: nextAttempt });
            }
            else {
                await this.prisma.automationCircuitBreaker.update({
                    where: { id: breaker.id },
                    data: { failureCount: newFailCount, lastFailureAt: new Date() },
                });
            }
        }
        async resetBreaker(provider, accountId, workspaceId) {
            const breaker = await this.getOrCreateBreaker(provider, accountId, workspaceId);
            await this.prisma.automationCircuitBreaker.update({
                where: { id: breaker.id },
                data: {
                    status: 'CLOSED',
                    failureCount: 0,
                    nextAttemptAt: null,
                },
            });
            await this.publishEvent('Circuit Breaker Closed', workspaceId, breaker.id, { provider, accountId });
        }
        async getBreakerState(provider, accountId, workspaceId) {
            const breaker = await this.getOrCreateBreaker(provider, accountId, workspaceId);
            return breaker.status;
        }
        async getOrCreateBreaker(provider, accountId, workspaceId) {
            const existing = await this.prisma.automationCircuitBreaker.findFirst({
                where: { provider, providerAccountId: accountId, workspaceId },
            });
            if (existing) {
                return existing;
            }
            return await this.prisma.automationCircuitBreaker.create({
                data: {
                    provider,
                    providerAccountId: accountId,
                    workspaceId,
                    status: 'CLOSED',
                },
            });
        }
        async publishEvent(name, workspaceId, causationId, payload) {
            const event = {
                id: (0, crypto_1.randomUUID)(),
                name,
                workspaceId,
                payload: {
                    entityId: causationId,
                    ...payload,
                },
                triggerVersion: '1.0',
                source: 'Circuit Breaker',
                correlationId: (0, crypto_1.randomUUID)(),
                causationId,
                occurredAt: new Date(),
                receivedAt: new Date(),
                processedAt: new Date(),
                timestamp: new Date(),
            };
            await this.eventBus.publish(event);
        }
    };
    return CircuitBreakerService = _classThis;
})();
exports.CircuitBreakerService = CircuitBreakerService;
//# sourceMappingURL=circuit-breaker.service.js.map