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
exports.SchedulerEngine = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let SchedulerEngine = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SchedulerEngine = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SchedulerEngine = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        lockService;
        timezoneService;
        eventBus;
        prisma;
        constructor(lockService, timezoneService, eventBus, prisma) {
            this.lockService = lockService;
            this.timezoneService = timezoneService;
            this.eventBus = eventBus;
            this.prisma = prisma;
        }
        async triggerSchedule(scheduleId, nodeId) {
            const schedule = await this.prisma.automationSchedule.findUnique({
                where: { id: scheduleId },
            });
            if (!schedule || schedule.status !== 'ACTIVE') {
                return;
            }
            const leaseMs = 30000;
            const acquired = await this.lockService.acquireLock(scheduleId, nodeId, leaseMs);
            if (!acquired) {
                return;
            }
            const correlationId = (0, crypto_1.randomUUID)();
            const startedAt = new Date();
            const execution = await this.prisma.automationScheduleExecution.create({
                data: {
                    workspaceId: schedule.workspaceId,
                    scheduleId,
                    correlationId,
                    nodeId,
                    status: 'RUNNING',
                    startedAt,
                },
            });
            try {
                const event = {
                    id: (0, crypto_1.randomUUID)(),
                    name: 'Schedule Triggered',
                    workspaceId: schedule.workspaceId,
                    payload: {
                        entityId: schedule.ruleId,
                        scheduleId,
                        ruleId: schedule.ruleId,
                        workspaceId: schedule.workspaceId,
                        provider: 'Scheduler',
                        correlationId,
                        triggerType: 'SCHEDULE',
                        scheduledTime: schedule.nextRunAtUtc || startedAt,
                    },
                    triggerVersion: '1.0',
                    source: 'Scheduler Engine',
                    correlationId,
                    causationId: execution.id,
                    occurredAt: new Date(),
                    receivedAt: new Date(),
                    processedAt: new Date(),
                    timestamp: new Date(),
                };
                await this.eventBus.publish(event);
                const completedAt = new Date();
                const durationMs = completedAt.getTime() - startedAt.getTime();
                const nextRunAt = this.timezoneService.calculateNextRun(schedule.cronExpression || '0 * * * *', schedule.timezone, completedAt);
                await this.prisma.automationScheduleExecution.update({
                    where: { id: execution.id },
                    data: {
                        status: 'SUCCESS',
                        completedAt,
                        durationMs,
                    },
                });
                await this.prisma.automationSchedule.update({
                    where: { id: scheduleId },
                    data: {
                        lastRunAtUtc: startedAt,
                        nextRunAtUtc: nextRunAt,
                    },
                });
            }
            catch (err) {
                const completedAt = new Date();
                const durationMs = completedAt.getTime() - startedAt.getTime();
                await this.prisma.automationScheduleExecution.update({
                    where: { id: execution.id },
                    data: {
                        status: 'FAILED',
                        completedAt,
                        durationMs,
                        error: err.message,
                    },
                });
            }
            finally {
                await this.lockService.releaseLock(scheduleId, nodeId);
            }
        }
        async pauseSchedule(scheduleId) {
            const schedule = await this.prisma.automationSchedule.findUnique({
                where: { id: scheduleId },
            });
            if (!schedule) {
                throw new common_1.NotFoundException(`Schedule ${scheduleId} not found.`);
            }
            await this.prisma.automationSchedule.update({
                where: { id: scheduleId },
                data: { status: 'PAUSED' },
            });
        }
        async resumeSchedule(scheduleId) {
            const schedule = await this.prisma.automationSchedule.findUnique({
                where: { id: scheduleId },
            });
            if (!schedule) {
                throw new common_1.NotFoundException(`Schedule ${scheduleId} not found.`);
            }
            const nextRun = this.timezoneService.calculateNextRun(schedule.cronExpression || '0 * * * *', schedule.timezone, new Date());
            await this.prisma.automationSchedule.update({
                where: { id: scheduleId },
                data: {
                    status: 'ACTIVE',
                    nextRunAtUtc: nextRun,
                },
            });
        }
    };
    return SchedulerEngine = _classThis;
})();
exports.SchedulerEngine = SchedulerEngine;
//# sourceMappingURL=scheduler-engine.service.js.map