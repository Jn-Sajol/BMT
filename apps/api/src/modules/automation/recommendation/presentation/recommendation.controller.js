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
exports.RecommendationController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../../../common/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let RecommendationController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Automation AI Recommendation & Optimization Engine'), (0, common_1.Controller)('api/automation/recommendations'), (0, common_1.UseGuards)(auth_guard_1.AuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getRecommendations_decorators;
    let _getHistory_decorators;
    let _getDashboard_decorators;
    let _getRecommendation_decorators;
    let _acceptRecommendation_decorators;
    let _rejectRecommendation_decorators;
    let _ignoreRecommendation_decorators;
    var RecommendationController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getRecommendations_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'List current recommendations' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getHistory_decorators = [(0, common_1.Get)('history'), (0, swagger_1.ApiOperation)({ summary: 'List historical action selections' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getDashboard_decorators = [(0, common_1.Get)('dashboard'), (0, swagger_1.ApiOperation)({ summary: 'Get workspace health dashboard projection telemetry data' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getRecommendation_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get recommendation detail' })];
            _acceptRecommendation_decorators = [(0, common_1.Post)(':id/accept'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Accept recommendation proposal' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _rejectRecommendation_decorators = [(0, common_1.Post)(':id/reject'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Reject recommendation proposal' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _ignoreRecommendation_decorators = [(0, common_1.Post)(':id/ignore'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Ignore recommendation proposal' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            __esDecorate(this, null, _getRecommendations_decorators, { kind: "method", name: "getRecommendations", static: false, private: false, access: { has: obj => "getRecommendations" in obj, get: obj => obj.getRecommendations }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getHistory_decorators, { kind: "method", name: "getHistory", static: false, private: false, access: { has: obj => "getHistory" in obj, get: obj => obj.getHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getDashboard_decorators, { kind: "method", name: "getDashboard", static: false, private: false, access: { has: obj => "getDashboard" in obj, get: obj => obj.getDashboard }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getRecommendation_decorators, { kind: "method", name: "getRecommendation", static: false, private: false, access: { has: obj => "getRecommendation" in obj, get: obj => obj.getRecommendation }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _acceptRecommendation_decorators, { kind: "method", name: "acceptRecommendation", static: false, private: false, access: { has: obj => "acceptRecommendation" in obj, get: obj => obj.acceptRecommendation }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _rejectRecommendation_decorators, { kind: "method", name: "rejectRecommendation", static: false, private: false, access: { has: obj => "rejectRecommendation" in obj, get: obj => obj.rejectRecommendation }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _ignoreRecommendation_decorators, { kind: "method", name: "ignoreRecommendation", static: false, private: false, access: { has: obj => "ignoreRecommendation" in obj, get: obj => obj.ignoreRecommendation }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RecommendationController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        historyService = __runInitializers(this, _instanceExtraInitializers);
        prisma;
        constructor(historyService, prisma) {
            this.historyService = historyService;
            this.prisma = prisma;
        }
        async getRecommendations(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.prisma.automationRecommendation.findMany({
                where: { workspaceId },
                orderBy: { createdAt: 'desc' },
            });
        }
        async getHistory(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.prisma.automationRecommendationHistory.findMany({
                where: {
                    recommendation: { workspaceId },
                },
                include: { recommendation: true },
                orderBy: { actionAt: 'desc' },
            });
        }
        async getDashboard(req) {
            const workspaceId = req.headers['x-workspace-id'];
            const dashboard = await this.prisma.automationRecommendationDashboardProjection.findUnique({
                where: { workspaceId },
            });
            if (!dashboard) {
                return {
                    workspaceId,
                    optimizationScore: 100.0,
                    automationHealth: 100.0,
                    potentialSavings: 0.0,
                    potentialRevenue: 0.0,
                    acceptedCount: 0,
                    rejectedCount: 0,
                    pendingCount: 0,
                };
            }
            return dashboard;
        }
        async getRecommendation(id) {
            const rec = await this.prisma.automationRecommendation.findUnique({
                where: { id },
            });
            if (!rec) {
                throw new common_1.NotFoundException(`Recommendation ${id} not found.`);
            }
            return rec;
        }
        async acceptRecommendation(id, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user?.id || '00000000-0000-0000-0000-000000000000';
            await this.historyService.accept(workspaceId, id, userId);
            return { success: true };
        }
        async rejectRecommendation(id, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user?.id || '00000000-0000-0000-0000-000000000000';
            await this.historyService.reject(workspaceId, id, userId);
            return { success: true };
        }
        async ignoreRecommendation(id, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user?.id || '00000000-0000-0000-0000-000000000000';
            await this.historyService.ignore(workspaceId, id, userId);
            return { success: true };
        }
    };
    return RecommendationController = _classThis;
})();
exports.RecommendationController = RecommendationController;
//# sourceMappingURL=recommendation.controller.js.map