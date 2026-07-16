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
exports.ProjectionService = void 0;
const common_1 = require("@nestjs/common");
let ProjectionService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ProjectionService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ProjectionService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        upcasterRegistry;
        constructor(prisma, upcasterRegistry) {
            this.prisma = prisma;
            this.upcasterRegistry = upcasterRegistry;
        }
        async projectEvent(event) {
            const rawPayload = event.payload || {};
            const currentVersion = event.eventVersion || '1.0';
            const provider = event.provider || 'Meta';
            // Upcast schema dynamically by provider
            const upcastedPayload = this.upcasterRegistry.upcast(provider, event.name, rawPayload, currentVersion, '2.0');
            const payload = upcastedPayload || {};
            const { ruleId, status, durationMs } = payload;
            const workspaceId = event.workspaceId;
            switch (event.name) {
                case 'Trigger Matched': {
                    const triggerType = payload.triggerType || 'unknown';
                    await this.prisma.automationTriggerPerformanceProjection.upsert({
                        where: {
                            workspaceId_triggerType: { workspaceId, triggerType },
                        },
                        update: {
                            matchedCount: { increment: 1 },
                            lastMatchedAt: event.occurredAt,
                        },
                        create: {
                            workspaceId,
                            triggerType,
                            matchedCount: 1,
                            lastMatchedAt: event.occurredAt,
                        },
                    });
                    break;
                }
                case 'Action Completed': {
                    const result = payload.result || {};
                    const actionName = result.executorName || 'unknown';
                    const isSuccess = result.status === 'SUCCESS';
                    const actDuration = Number(result.duration || 0);
                    const proj = await this.prisma.automationActionPerformanceProjection.findUnique({
                        where: {
                            workspaceId_actionType: { workspaceId, actionType: actionName },
                        },
                    });
                    const newCount = (proj?.executionsCount || 0) + 1;
                    const newAvg = proj
                        ? (proj.averageDurationMs * proj.executionsCount + actDuration) / newCount
                        : actDuration;
                    await this.prisma.automationActionPerformanceProjection.upsert({
                        where: {
                            workspaceId_actionType: { workspaceId, actionType: actionName },
                        },
                        update: {
                            executionsCount: { increment: 1 },
                            successCount: { increment: isSuccess ? 1 : 0 },
                            failedCount: { increment: !isSuccess ? 1 : 0 },
                            averageDurationMs: newAvg,
                        },
                        create: {
                            workspaceId,
                            actionType: actionName,
                            executionsCount: 1,
                            successCount: isSuccess ? 1 : 0,
                            failedCount: !isSuccess ? 1 : 0,
                            averageDurationMs: actDuration,
                        },
                    });
                    break;
                }
                case 'Execution Completed': {
                    const isSuccess = status === 'SUCCESS' || status === 'PARTIAL_SUCCESS';
                    const dur = Number(durationMs || 0);
                    // 1. Rule Performance
                    const ruleProj = await this.prisma.automationRulePerformanceProjection.findUnique({
                        where: { ruleId },
                    });
                    const ruleName = ruleProj?.name || `Rule ${ruleId}`;
                    const newRuleCount = (ruleProj?.executionsCount || 0) + 1;
                    const newRuleAvg = ruleProj
                        ? (ruleProj.averageDurationMs * ruleProj.executionsCount + dur) / newRuleCount
                        : dur;
                    await this.prisma.automationRulePerformanceProjection.upsert({
                        where: { ruleId },
                        update: {
                            executionsCount: { increment: 1 },
                            successCount: { increment: isSuccess ? 1 : 0 },
                            failedCount: { increment: !isSuccess ? 1 : 0 },
                            lastExecutedAt: event.occurredAt,
                            averageDurationMs: newRuleAvg,
                        },
                        create: {
                            ruleId,
                            workspaceId,
                            name: ruleName,
                            executionsCount: 1,
                            successCount: isSuccess ? 1 : 0,
                            failedCount: !isSuccess ? 1 : 0,
                            lastExecutedAt: event.occurredAt,
                            averageDurationMs: dur,
                        },
                    });
                    // 2. Execution Performance
                    await this.prisma.automationExecutionPerformanceProjection.upsert({
                        where: { correlationId: event.correlationId },
                        update: {
                            status,
                            durationMs: dur,
                            completedAt: event.occurredAt,
                        },
                        create: {
                            workspaceId,
                            correlationId: event.correlationId,
                            ruleId,
                            status,
                            durationMs: dur,
                            startedAt: event.receivedAt || event.occurredAt,
                            completedAt: event.occurredAt,
                        },
                    });
                    // 3. Aggregation Update
                    await this.updateAggregatedStats(workspaceId, ruleId, isSuccess, dur, event.occurredAt);
                    break;
                }
            }
        }
        async rebuildProjections(workspaceId) {
            await this.prisma.automationRulePerformanceProjection.deleteMany({ where: { workspaceId } });
            await this.prisma.automationActionPerformanceProjection.deleteMany({ where: { workspaceId } });
            await this.prisma.automationTriggerPerformanceProjection.deleteMany({ where: { workspaceId } });
            await this.prisma.automationExecutionPerformanceProjection.deleteMany({ where: { workspaceId } });
            await this.prisma.automationAggregatedStats.deleteMany({ where: { workspaceId } });
            const events = await this.prisma.automationTimelineEvent.findMany({
                where: { workspaceId },
                orderBy: { createdAt: 'asc' },
            });
            for (const evt of events) {
                const event = {
                    id: evt.id,
                    name: evt.eventName,
                    workspaceId: evt.workspaceId,
                    payload: evt.payload,
                    triggerVersion: '1.0',
                    eventVersion: evt.eventVersion || '1.0',
                    provider: evt.provider || 'Meta',
                    source: 'Event Store',
                    correlationId: evt.correlationId,
                    causationId: evt.causationId,
                    occurredAt: evt.createdAt,
                    receivedAt: evt.createdAt,
                    processedAt: evt.createdAt,
                    timestamp: evt.createdAt,
                };
                await this.projectEvent(event);
            }
        }
        async updateAggregatedStats(workspaceId, ruleId, isSuccess, durationMs, occurredAt) {
            const dates = this.getPeriodsTimestamps(occurredAt);
            for (const item of dates) {
                await this.prisma.automationAggregatedStats.upsert({
                    where: {
                        workspaceId_ruleId_period_timestamp: {
                            workspaceId,
                            ruleId,
                            period: item.period,
                            timestamp: item.timestamp,
                        },
                    },
                    update: {
                        executionsCount: { increment: 1 },
                        successCount: { increment: isSuccess ? 1 : 0 },
                        failedCount: { increment: !isSuccess ? 1 : 0 },
                    },
                    create: {
                        workspaceId,
                        ruleId,
                        period: item.period,
                        timestamp: item.timestamp,
                        executionsCount: 1,
                        successCount: isSuccess ? 1 : 0,
                        failedCount: !isSuccess ? 1 : 0,
                        averageDurationMs: durationMs,
                    },
                });
            }
        }
        getPeriodsTimestamps(date) {
            const d = new Date(date);
            const daily = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
            const day = d.getUTCDay();
            const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
            const weekly = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
            const monthly = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
            return [
                { period: 'DAILY', timestamp: daily },
                { period: 'WEEKLY', timestamp: weekly },
                { period: 'MONTHLY', timestamp: monthly },
            ];
        }
    };
    return ProjectionService = _classThis;
})();
exports.ProjectionService = ProjectionService;
//# sourceMappingURL=projection.service.js.map