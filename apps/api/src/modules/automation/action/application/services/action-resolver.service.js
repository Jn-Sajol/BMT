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
exports.ActionResolver = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let ActionResolver = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ActionResolver = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ActionResolver = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        registry;
        eventBus;
        constructor(registry, eventBus) {
            this.registry = registry;
            this.eventBus = eventBus;
        }
        async executeActions(actions, policy = 'Sequential Execution', context) {
            const results = [];
            for (const action of actions) {
                const actionId = action.id || (0, crypto_1.randomUUID)();
                const actionType = action.type;
                const params = action.params || {};
                const entityId = params.campaignId || params.adSetId || params.adId || 'unknown';
                const executor = this.registry.getExecutor(actionType);
                if (!executor) {
                    const startedAt = new Date();
                    const failedResult = {
                        actionId,
                        executorName: 'Unknown',
                        status: 'FAILED',
                        startedAt,
                        completedAt: new Date(),
                        duration: 0,
                        retryable: false,
                        correlationId: context.correlationId,
                        explainability: { actionType, params },
                        error: `No action executor found for action type: ${actionType}`,
                    };
                    results.push(failedResult);
                    await this.publishEvent(failedResult, context.workspaceId, entityId);
                    if (policy === 'Stop On First Failure') {
                        break;
                    }
                    continue;
                }
                const actionContext = {
                    ...context,
                    actionId,
                };
                const startMs = Date.now();
                const executePromise = executor.execute(params, actionContext);
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error(`Action ${actionType} timed out after 10s`)), 10000));
                try {
                    const res = await Promise.race([executePromise, timeoutPromise]);
                    results.push(res);
                    await this.publishEvent(res, context.workspaceId, entityId);
                    if (res.status === 'FAILED' && policy === 'Stop On First Failure') {
                        break;
                    }
                }
                catch (err) {
                    const failedResult = {
                        actionId,
                        executorName: executor.constructor.name,
                        status: 'FAILED',
                        startedAt: new Date(startMs),
                        completedAt: new Date(),
                        duration: Date.now() - startMs,
                        retryable: true,
                        correlationId: context.correlationId,
                        explainability: { actionType, params },
                        error: err.message,
                    };
                    results.push(failedResult);
                    await this.publishEvent(failedResult, context.workspaceId, entityId);
                    if (policy === 'Stop On First Failure') {
                        break;
                    }
                }
            }
            return results;
        }
        async publishEvent(res, workspaceId, entityId) {
            const event = {
                id: (0, crypto_1.randomUUID)(),
                name: 'Action Completed',
                workspaceId,
                payload: {
                    entityId,
                    result: res,
                },
                triggerVersion: '1.0',
                source: 'Action Library',
                correlationId: res.correlationId,
                causationId: res.actionId,
                occurredAt: res.completedAt,
                receivedAt: res.startedAt,
                processedAt: new Date(),
                timestamp: res.completedAt,
            };
            await this.eventBus.publish(event);
        }
    };
    return ActionResolver = _classThis;
})();
exports.ActionResolver = ActionResolver;
//# sourceMappingURL=action-resolver.service.js.map