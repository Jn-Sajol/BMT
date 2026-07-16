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
exports.RetryWorker = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let RetryWorker = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RetryWorker = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RetryWorker = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        queue;
        eventBus;
        pollTimer;
        isShuttingDown = false;
        workerId = `worker-${(0, crypto_1.randomUUID)()}`;
        constructor(queue, eventBus) {
            this.queue = queue;
            this.eventBus = eventBus;
        }
        onApplicationBootstrap() {
            this.isShuttingDown = false;
            this.pollTimer = setInterval(() => this.processNextRetry(), 5000);
        }
        onApplicationShutdown() {
            this.isShuttingDown = true;
            if (this.pollTimer)
                clearInterval(this.pollTimer);
        }
        async processNextRetry() {
            if (this.isShuttingDown)
                return;
            try {
                const context = await this.queue.dequeueNext();
                if (!context)
                    return;
                const actionIdStr = context.actionId || 'noaction';
                const attemptStr = String(context.retryCount);
                const idempotencyKey = (0, crypto_1.createHash)('sha256')
                    .update(`${context.correlationId}_${actionIdStr}_${attemptStr}`)
                    .digest('hex');
                try {
                    const start = Date.now();
                    const event = {
                        id: (0, crypto_1.randomUUID)(),
                        name: 'Retry Triggered',
                        workspaceId: context.workspaceId,
                        payload: {
                            ...context.payload,
                            retryCount: context.retryCount,
                            idempotencyKey,
                            workerId: this.workerId,
                        },
                        triggerVersion: '1.0',
                        source: 'Retry Worker',
                        correlationId: context.correlationId,
                        causationId: context.executionId || (0, crypto_1.randomUUID)(),
                        occurredAt: new Date(),
                        receivedAt: new Date(),
                        processedAt: new Date(),
                        timestamp: new Date(),
                    };
                    await this.eventBus.publish(event);
                    await this.queue.completeRetry(idempotencyKey);
                }
                catch (err) {
                    await this.queue.failRetry(idempotencyKey, err.message);
                }
            }
            catch {
                // Resilient pass
            }
        }
        getWorkerId() {
            return this.workerId;
        }
    };
    return RetryWorker = _classThis;
})();
exports.RetryWorker = RetryWorker;
//# sourceMappingURL=retry-worker.service.js.map