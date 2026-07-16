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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../../../common/guards/auth.guard");
let AnalyticsController = (() => {
    let _classDecorators = [(0, common_1.Controller)('api/automation/analytics'), (0, common_1.UseGuards)(auth_guard_1.AuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getTimeline_decorators;
    let _getRulePerformance_decorators;
    let _getActionPerformance_decorators;
    let _getTriggerPerformance_decorators;
    let _getExecutionPerformance_decorators;
    let _getAggregates_decorators;
    let _rebuildProjections_decorators;
    var AnalyticsController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getTimeline_decorators = [(0, common_1.Get)('timeline')];
            _getRulePerformance_decorators = [(0, common_1.Get)('rule-performance')];
            _getActionPerformance_decorators = [(0, common_1.Get)('action-performance')];
            _getTriggerPerformance_decorators = [(0, common_1.Get)('trigger-performance')];
            _getExecutionPerformance_decorators = [(0, common_1.Get)('execution-performance')];
            _getAggregates_decorators = [(0, common_1.Get)('aggregates')];
            _rebuildProjections_decorators = [(0, common_1.Post)('rebuild'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            __esDecorate(this, null, _getTimeline_decorators, { kind: "method", name: "getTimeline", static: false, private: false, access: { has: obj => "getTimeline" in obj, get: obj => obj.getTimeline }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getRulePerformance_decorators, { kind: "method", name: "getRulePerformance", static: false, private: false, access: { has: obj => "getRulePerformance" in obj, get: obj => obj.getRulePerformance }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getActionPerformance_decorators, { kind: "method", name: "getActionPerformance", static: false, private: false, access: { has: obj => "getActionPerformance" in obj, get: obj => obj.getActionPerformance }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getTriggerPerformance_decorators, { kind: "method", name: "getTriggerPerformance", static: false, private: false, access: { has: obj => "getTriggerPerformance" in obj, get: obj => obj.getTriggerPerformance }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getExecutionPerformance_decorators, { kind: "method", name: "getExecutionPerformance", static: false, private: false, access: { has: obj => "getExecutionPerformance" in obj, get: obj => obj.getExecutionPerformance }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getAggregates_decorators, { kind: "method", name: "getAggregates", static: false, private: false, access: { has: obj => "getAggregates" in obj, get: obj => obj.getAggregates }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _rebuildProjections_decorators, { kind: "method", name: "rebuildProjections", static: false, private: false, access: { has: obj => "rebuildProjections" in obj, get: obj => obj.rebuildProjections }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AnalyticsController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        projectionService = __runInitializers(this, _instanceExtraInitializers);
        prisma;
        constructor(projectionService, prisma) {
            this.projectionService = projectionService;
            this.prisma = prisma;
        }
        async getTimeline(workspaceId) {
            return await this.prisma.automationTimelineEvent.findMany({
                where: { workspaceId },
                orderBy: { createdAt: 'desc' },
            });
        }
        async getRulePerformance(workspaceId) {
            return await this.prisma.automationRulePerformanceProjection.findMany({
                where: { workspaceId },
                orderBy: { executionsCount: 'desc' },
            });
        }
        async getActionPerformance(workspaceId) {
            return await this.prisma.automationActionPerformanceProjection.findMany({
                where: { workspaceId },
                orderBy: { executionsCount: 'desc' },
            });
        }
        async getTriggerPerformance(workspaceId) {
            return await this.prisma.automationTriggerPerformanceProjection.findMany({
                where: { workspaceId },
                orderBy: { matchedCount: 'desc' },
            });
        }
        async getExecutionPerformance(workspaceId) {
            return await this.prisma.automationExecutionPerformanceProjection.findMany({
                where: { workspaceId },
                orderBy: { startedAt: 'desc' },
            });
        }
        async getAggregates(workspaceId, period) {
            return await this.prisma.automationAggregatedStats.findMany({
                where: {
                    workspaceId,
                    period: period || 'DAILY',
                },
                orderBy: { timestamp: 'desc' },
            });
        }
        async rebuildProjections(workspaceId) {
            await this.projectionService.rebuildProjections(workspaceId);
            return { status: 'SUCCESS', message: 'Projections rebuilt successfully.' };
        }
    };
    return AnalyticsController = _classThis;
})();
exports.AnalyticsController = AnalyticsController;
//# sourceMappingURL=analytics.controller.js.map