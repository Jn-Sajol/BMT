"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../../../common/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let SchedulerController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Scheduler Engine'), (0, common_1.Controller)('api/automation/schedules'), (0, common_1.UseGuards)(auth_guard_1.AuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getSchedules_decorators;
    let _getHistory_decorators;
    let _runNow_decorators;
    let _pauseSchedule_decorators;
    let _resumeSchedule_decorators;
    let _checkHealth_decorators;
    var SchedulerController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getSchedules_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Get active/paused rules schedules' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getHistory_decorators = [(0, common_1.Get)('history'), (0, swagger_1.ApiOperation)({ summary: 'Get execution history audit records' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _runNow_decorators = [(0, common_1.Post)('run-now'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Manually trigger rules schedule execution instantly' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _pauseSchedule_decorators = [(0, common_1.Post)('pause'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Pause automated execution for schedule' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _resumeSchedule_decorators = [(0, common_1.Post)('resume'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Resume schedule active evaluations' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _checkHealth_decorators = [(0, common_1.Get)('health'), (0, swagger_1.ApiOperation)({ summary: 'Query cluster scheduler health node state' })];
            __esDecorate(this, null, _getSchedules_decorators, { kind: "method", name: "getSchedules", static: false, private: false, access: { has: obj => "getSchedules" in obj, get: obj => obj.getSchedules }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getHistory_decorators, { kind: "method", name: "getHistory", static: false, private: false, access: { has: obj => "getHistory" in obj, get: obj => obj.getHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _runNow_decorators, { kind: "method", name: "runNow", static: false, private: false, access: { has: obj => "runNow" in obj, get: obj => obj.runNow }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _pauseSchedule_decorators, { kind: "method", name: "pauseSchedule", static: false, private: false, access: { has: obj => "pauseSchedule" in obj, get: obj => obj.pauseSchedule }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _resumeSchedule_decorators, { kind: "method", name: "resumeSchedule", static: false, private: false, access: { has: obj => "resumeSchedule" in obj, get: obj => obj.resumeSchedule }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _checkHealth_decorators, { kind: "method", name: "checkHealth", static: false, private: false, access: { has: obj => "checkHealth" in obj, get: obj => obj.checkHealth }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SchedulerController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        engine = __runInitializers(this, _instanceExtraInitializers);
        loop;
        prisma;
        constructor(engine, loop, prisma) {
            this.engine = engine;
            this.loop = loop;
            this.prisma = prisma;
        }
        async getSchedules(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.prisma.automationSchedule.findMany({
                where: { workspaceId },
            });
        }
        async getHistory(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.prisma.automationScheduleExecution.findMany({
                where: { workspaceId },
                orderBy: { startedAt: 'desc' },
            });
        }
        async runNow(scheduleId) {
            const nodeId = this.loop.getNodeId();
            await this.engine.triggerSchedule(scheduleId, nodeId);
            return { success: true, triggeredBy: nodeId };
        }
        async pauseSchedule(scheduleId) {
            await this.engine.pauseSchedule(scheduleId);
            return { status: 'PAUSED' };
        }
        async resumeSchedule(scheduleId) {
            await this.engine.resumeSchedule(scheduleId);
            return { status: 'ACTIVE' };
        }
        async checkHealth() {
            const activeNodesCount = await this.prisma.automationSchedulerNode.count({
                where: { status: 'ACTIVE' },
            });
            return {
                status: 'healthy',
                currentNodeId: this.loop.getNodeId(),
                clusterSize: activeNodesCount,
            };
        }
    };
    return SchedulerController = _classThis;
})();
exports.SchedulerController = SchedulerController;
//# sourceMappingURL=scheduler.controller.js.map