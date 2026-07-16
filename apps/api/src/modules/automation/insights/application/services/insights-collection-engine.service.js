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
exports.InsightsCollectionEngine = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
let InsightsCollectionEngine = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var InsightsCollectionEngine = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            InsightsCollectionEngine = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        registry;
        eventBus;
        prisma;
        constructor(registry, eventBus, prisma) {
            this.registry = registry;
            this.eventBus = eventBus;
            this.prisma = prisma;
        }
        async triggerSync(workspaceId, providerName, syncMode) {
            const provider = this.registry.getProvider(providerName);
            if (!provider) {
                throw new common_1.NotFoundException(`No insights provider registered for: ${providerName}`);
            }
            const syncRun = await this.prisma.automationInsightsSyncRun.create({
                data: {
                    workspaceId,
                    provider: providerName,
                    syncMode,
                    startedAt: new Date(),
                    status: 'RUNNING',
                },
            });
            await this.publishEvent('Insights Sync Started', workspaceId, syncRun.id, { syncRunId: syncRun.id, providerName });
            let pagesCollected = 0;
            let rowsNormalized = 0;
            let rowsInserted = 0;
            let duplicatesSkipped = 0;
            let totalLatency = 0;
            let retryCount = 0;
            let nextCursor = undefined;
            let checkpoint = undefined;
            if (syncMode === 'INCREMENTAL_SYNC') {
                const cursorState = await this.prisma.automationInsightsSyncCursor.findUnique({
                    where: {
                        workspace_provider_syncMode: { workspaceId, provider: providerName, syncMode },
                    },
                });
                if (cursorState) {
                    nextCursor = cursorState.pageCursor || undefined;
                    checkpoint = cursorState.checkpoint || undefined;
                }
            }
            try {
                let isDone = false;
                while (!isDone) {
                    let attempt = 0;
                    let response;
                    while (attempt < 3) {
                        try {
                            response = await provider.collectInsights(workspaceId, syncMode, nextCursor, checkpoint);
                            break;
                        }
                        catch (err) {
                            attempt++;
                            retryCount++;
                            if (attempt >= 3) {
                                throw err;
                            }
                            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
                            await new Promise((resolve) => setTimeout(resolve, delay));
                        }
                    }
                    if (!response) {
                        throw new Error('Failed to retrieve insights response.');
                    }
                    pagesCollected += response.pagesCollected;
                    totalLatency += response.apiLatencyMs;
                    nextCursor = response.nextCursor;
                    checkpoint = response.nextCheckpoint;
                    await this.publishEvent('Insights Page Collected', workspaceId, syncRun.id, { syncRunId: syncRun.id, pageNumber: pagesCollected });
                    const metrics = response.metrics;
                    rowsNormalized += metrics.length;
                    await this.publishEvent('Insights Normalized', workspaceId, syncRun.id, { syncRunId: syncRun.id, count: metrics.length });
                    for (const metric of metrics) {
                        try {
                            await this.prisma.automationCanonicalMetric.create({
                                data: {
                                    workspaceId,
                                    provider: providerName,
                                    entityType: metric.entityType,
                                    entityId: metric.entityId,
                                    metricDate: metric.metricDate,
                                    granularity: metric.granularity,
                                    metricVersion: metric.metricVersion || 1,
                                    impressions: metric.impressions,
                                    clicks: metric.clicks,
                                    reach: metric.reach,
                                    frequency: metric.frequency,
                                    spend: metric.spend,
                                    cpm: metric.cpm,
                                    cpc: metric.cpc,
                                    ctr: metric.ctr,
                                    conversions: metric.conversions,
                                    videoViews: metric.videoViews,
                                    engagement: metric.engagement,
                                    rawPayload: metric.rawPayload,
                                    sourcePayloadHash: metric.sourcePayloadHash,
                                    sourceRequestId: metric.sourceRequestId,
                                    syncRunId: syncRun.id,
                                },
                            });
                            rowsInserted++;
                        }
                        catch (err) {
                            if (err.code === 'P2002') {
                                duplicatesSkipped++;
                            }
                            else {
                                throw err;
                            }
                        }
                    }
                    await this.publishEvent('Insights Persisted', workspaceId, syncRun.id, { syncRunId: syncRun.id, inserted: rowsInserted });
                    if (!nextCursor) {
                        isDone = true;
                    }
                }
                await this.prisma.automationInsightsSyncCursor.upsert({
                    where: {
                        workspace_provider_syncMode: { workspaceId, provider: providerName, syncMode },
                    },
                    update: {
                        lastSuccessfulSyncAt: new Date(),
                        pageCursor: null,
                        checkpoint: client_1.Prisma.JsonNull,
                    },
                    create: {
                        workspaceId,
                        provider: providerName,
                        syncMode,
                        lastSuccessfulSyncAt: new Date(),
                        pageCursor: null,
                        checkpoint: checkpoint ? checkpoint : client_1.Prisma.JsonNull,
                    },
                });
                const updatedRun = await this.prisma.automationInsightsSyncRun.update({
                    where: { id: syncRun.id },
                    data: {
                        status: 'SUCCESS',
                        finishedAt: new Date(),
                        pagesCollected,
                        rowsNormalized,
                        rowsInserted,
                        duplicatesSkipped,
                        retryCount,
                        apiLatencyMs: totalLatency,
                    },
                });
                await this.publishEvent('Insights Sync Completed', workspaceId, syncRun.id, { syncRunId: syncRun.id, status: 'SUCCESS' });
                return updatedRun;
            }
            catch (err) {
                if (nextCursor || checkpoint) {
                    await this.prisma.automationInsightsSyncCursor.upsert({
                        where: {
                            workspace_provider_syncMode: { workspaceId, provider: providerName, syncMode },
                        },
                        update: {
                            pageCursor: nextCursor || null,
                            checkpoint: checkpoint ? checkpoint : client_1.Prisma.JsonNull,
                        },
                        create: {
                            workspaceId,
                            provider: providerName,
                            syncMode,
                            pageCursor: nextCursor || null,
                            checkpoint: checkpoint ? checkpoint : client_1.Prisma.JsonNull,
                        },
                    });
                }
                const failedRun = await this.prisma.automationInsightsSyncRun.update({
                    where: { id: syncRun.id },
                    data: {
                        status: 'FAILED',
                        finishedAt: new Date(),
                        pagesCollected,
                        rowsNormalized,
                        rowsInserted,
                        duplicatesSkipped,
                        retryCount,
                        apiLatencyMs: totalLatency,
                        errorMessage: err.message,
                    },
                });
                await this.publishEvent('Insights Sync Completed', workspaceId, syncRun.id, { syncRunId: syncRun.id, status: 'FAILED', error: err.message });
                throw err;
            }
        }
        async publishEvent(name, workspaceId, causationId, payload) {
            const event = {
                id: (0, crypto_1.randomUUID)(),
                name,
                workspaceId,
                payload,
                triggerVersion: '1.0',
                source: 'Insights Engine',
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
    return InsightsCollectionEngine = _classThis;
})();
exports.InsightsCollectionEngine = InsightsCollectionEngine;
//# sourceMappingURL=insights-collection-engine.service.js.map