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
exports.ReliabilityObserver = void 0;
const common_1 = require("@nestjs/common");
let ReliabilityObserver = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ReliabilityObserver = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ReliabilityObserver = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        eventBus;
        classifier;
        retryQueue;
        deadLetterStore;
        breaker;
        retryRegistry;
        prisma;
        constructor(eventBus, classifier, retryQueue, deadLetterStore, breaker, retryRegistry, prisma) {
            this.eventBus = eventBus;
            this.classifier = classifier;
            this.retryQueue = retryQueue;
            this.deadLetterStore = deadLetterStore;
            this.breaker = breaker;
            this.retryRegistry = retryRegistry;
            this.prisma = prisma;
        }
        onModuleInit() {
            this.eventBus.subscribe('*', this.handleEvent.bind(this));
        }
        async handleEvent(event) {
            const targetNames = ['Execution Completed', 'Action Completed', 'Rule Failed', 'Schedule Failed'];
            if (!targetNames.includes(event.name)) {
                return;
            }
            const payload = event.payload || {};
            const isFailed = payload.status === 'FAILED' || payload.error;
            const provider = payload.provider || 'Meta';
            const providerAccountId = payload.providerAccountId || 'default';
            if (!isFailed) {
                await this.breaker.recordSuccess(provider, providerAccountId, event.workspaceId);
                return;
            }
            try {
                const errorMsg = payload.error || 'Execution encountered transient error.';
                const classification = this.classifier.classifyFailure(new Error(errorMsg));
                await this.prisma.automationFailureHistory.create({
                    data: {
                        workspaceId: event.workspaceId,
                        provider,
                        classification: classification.category,
                        severity: classification.severity,
                        error: errorMsg,
                        correlationId: event.correlationId,
                    },
                });
                await this.breaker.recordFailure(provider, providerAccountId, event.workspaceId);
                const allowed = await this.breaker.checkCallAllowed(provider, providerAccountId, event.workspaceId);
                const retryCount = payload.retryCount || 0;
                const maxRetries = payload.maxRetries || 5;
                if (!allowed || !classification.retryable || retryCount >= maxRetries) {
                    await this.deadLetterStore.storeDeadLetter(event.workspaceId, provider, event.name, payload, event.correlationId, event.causationId, allowed ? `Failure classified as non-retryable or max attempts hit (${retryCount}/${maxRetries}).` : 'Provider Circuit Breaker is currently OPEN.', retryCount);
                }
                else {
                    const strategy = this.retryRegistry.resolve(classification.recommendedPolicy);
                    const retryCtx = {
                        correlationId: event.correlationId,
                        workspaceId: event.workspaceId,
                        provider,
                        providerAccountId,
                        executionId: event.causationId,
                        actionId: payload.actionId || undefined,
                        retryCount: retryCount + 1,
                        maxRetries,
                        firstFailureAt: event.occurredAt,
                        lastFailureAt: new Date(),
                        retryPolicy: strategy.policyName,
                        payload,
                        nextRetryAt: undefined,
                    };
                    const nextRetryAt = strategy.calculateNextRetry(retryCtx);
                    retryCtx.nextRetryAt = nextRetryAt;
                    await this.retryQueue.enqueue(retryCtx, 'NORMAL');
                }
            }
            catch (err) {
                console.error('Passive Reliability Observer error handling event:', err);
            }
        }
    };
    return ReliabilityObserver = _classThis;
})();
exports.ReliabilityObserver = ReliabilityObserver;
//# sourceMappingURL=reliability-observer.service.js.map