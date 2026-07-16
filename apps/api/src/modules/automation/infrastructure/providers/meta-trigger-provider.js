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
exports.MetaTriggerProvider = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let MetaTriggerProvider = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MetaTriggerProvider = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MetaTriggerProvider = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        providerName = 'meta';
        supports(source) {
            const metaSources = ['Webhook', 'Scheduler', 'Insights Sync', 'Status Sync', 'Manual', 'Lifecycle'];
            return metaSources.includes(source);
        }
        async normalize(rawPayload, metadata) {
            const events = [];
            const occurredAt = rawPayload.occurredAt ? new Date(rawPayload.occurredAt) : new Date();
            if (metadata.source === 'Webhook') {
                if (rawPayload.entry && Array.isArray(rawPayload.entry)) {
                    for (const entry of rawPayload.entry) {
                        if (entry.changes && Array.isArray(entry.changes)) {
                            for (const change of entry.changes) {
                                events.push({
                                    id: (0, crypto_1.randomUUID)(),
                                    name: 'Webhook Received',
                                    workspaceId: metadata.workspaceId,
                                    payload: {
                                        entityId: entry.id || 'unknown',
                                        field: change.field,
                                        value: change.value,
                                        rawChange: change,
                                    },
                                    triggerVersion: '1.0',
                                    source: metadata.source,
                                    correlationId: metadata.correlationId,
                                    causationId: metadata.causationId,
                                    occurredAt,
                                    receivedAt: metadata.receivedAt,
                                    processedAt: new Date(),
                                    timestamp: occurredAt,
                                });
                            }
                        }
                    }
                }
                else {
                    events.push({
                        id: (0, crypto_1.randomUUID)(),
                        name: 'Webhook Received',
                        workspaceId: metadata.workspaceId,
                        payload: {
                            entityId: rawPayload.entityId || 'unknown',
                            ...rawPayload,
                        },
                        triggerVersion: '1.0',
                        source: metadata.source,
                        correlationId: metadata.correlationId,
                        causationId: metadata.causationId,
                        occurredAt,
                        receivedAt: metadata.receivedAt,
                        processedAt: new Date(),
                        timestamp: occurredAt,
                    });
                }
            }
            else if (metadata.source === 'Insights Sync') {
                events.push({
                    id: (0, crypto_1.randomUUID)(),
                    name: 'Insights Synced',
                    workspaceId: metadata.workspaceId,
                    payload: {
                        entityId: rawPayload.campaignId || rawPayload.adSetId || rawPayload.adId || 'unknown',
                        spend: Number(rawPayload.spend || 0),
                        reach: Number(rawPayload.reach || 0),
                        impressions: Number(rawPayload.impressions || 0),
                        ctr: Number(rawPayload.ctr || 0),
                        cpc: Number(rawPayload.cpc || 0),
                        cpm: Number(rawPayload.cpm || 0),
                        roas: Number(rawPayload.roas || 0),
                        frequency: Number(rawPayload.frequency || 0),
                    },
                    triggerVersion: '1.0',
                    source: metadata.source,
                    correlationId: metadata.correlationId,
                    causationId: metadata.causationId,
                    occurredAt,
                    receivedAt: metadata.receivedAt,
                    processedAt: new Date(),
                    timestamp: occurredAt,
                });
            }
            else if (metadata.source === 'Status Sync') {
                events.push({
                    id: (0, crypto_1.randomUUID)(),
                    name: 'Status Changed',
                    workspaceId: metadata.workspaceId,
                    payload: {
                        entityId: rawPayload.entityId || 'unknown',
                        status: rawPayload.status,
                        effectiveStatus: rawPayload.effectiveStatus,
                    },
                    triggerVersion: '1.0',
                    source: metadata.source,
                    correlationId: metadata.correlationId,
                    causationId: metadata.causationId,
                    occurredAt,
                    receivedAt: metadata.receivedAt,
                    processedAt: new Date(),
                    timestamp: occurredAt,
                });
            }
            else if (metadata.source === 'Scheduler') {
                events.push({
                    id: (0, crypto_1.randomUUID)(),
                    name: 'Schedule',
                    workspaceId: metadata.workspaceId,
                    payload: {
                        entityId: 'scheduler',
                        cron: rawPayload.cron,
                    },
                    triggerVersion: '1.0',
                    source: metadata.source,
                    correlationId: metadata.correlationId,
                    causationId: metadata.causationId,
                    occurredAt,
                    receivedAt: metadata.receivedAt,
                    processedAt: new Date(),
                    timestamp: occurredAt,
                });
            }
            else if (metadata.source === 'Manual') {
                events.push({
                    id: (0, crypto_1.randomUUID)(),
                    name: 'Manual',
                    workspaceId: metadata.workspaceId,
                    payload: {
                        entityId: rawPayload.entityId || 'manual',
                        ...rawPayload,
                    },
                    triggerVersion: '1.0',
                    source: metadata.source,
                    correlationId: metadata.correlationId,
                    causationId: metadata.causationId,
                    occurredAt,
                    receivedAt: metadata.receivedAt,
                    processedAt: new Date(),
                    timestamp: occurredAt,
                });
            }
            else if (metadata.source === 'Lifecycle') {
                events.push({
                    id: (0, crypto_1.randomUUID)(),
                    name: rawPayload.eventName,
                    workspaceId: metadata.workspaceId,
                    payload: {
                        entityId: rawPayload.entityId || 'unknown',
                        status: rawPayload.status,
                    },
                    triggerVersion: '1.0',
                    source: metadata.source,
                    correlationId: metadata.correlationId,
                    causationId: metadata.causationId,
                    occurredAt,
                    receivedAt: metadata.receivedAt,
                    processedAt: new Date(),
                    timestamp: occurredAt,
                });
            }
            return events;
        }
    };
    return MetaTriggerProvider = _classThis;
})();
exports.MetaTriggerProvider = MetaTriggerProvider;
//# sourceMappingURL=meta-trigger-provider.js.map