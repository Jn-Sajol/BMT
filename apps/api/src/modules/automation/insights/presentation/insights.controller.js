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
exports.InsightsController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../../../common/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let InsightsController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Insights Collection Engine'), (0, common_1.Controller)({ path: 'insights', version: '1' }), (0, common_1.UseGuards)(auth_guard_1.AuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getSyncStatus_decorators;
    let _fullSync_decorators;
    let _incrementalSync_decorators;
    let _backfill_decorators;
    let _getHistory_decorators;
    var InsightsController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getSyncStatus_decorators = [(0, common_1.Get)('sync-status'), (0, swagger_1.ApiOperation)({ summary: 'Get current sync status/cursors' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _fullSync_decorators = [(0, common_1.Post)('full-sync'), (0, swagger_1.ApiOperation)({ summary: 'Trigger full metrics sync run' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _incrementalSync_decorators = [(0, common_1.Post)('incremental-sync'), (0, swagger_1.ApiOperation)({ summary: 'Trigger incremental metrics sync run' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _backfill_decorators = [(0, common_1.Post)('backfill'), (0, swagger_1.ApiOperation)({ summary: 'Trigger historical metrics backfill run' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getHistory_decorators = [(0, common_1.Get)('history'), (0, swagger_1.ApiOperation)({ summary: 'Get sync runs audit timeline' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            __esDecorate(this, null, _getSyncStatus_decorators, { kind: "method", name: "getSyncStatus", static: false, private: false, access: { has: obj => "getSyncStatus" in obj, get: obj => obj.getSyncStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _fullSync_decorators, { kind: "method", name: "fullSync", static: false, private: false, access: { has: obj => "fullSync" in obj, get: obj => obj.fullSync }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _incrementalSync_decorators, { kind: "method", name: "incrementalSync", static: false, private: false, access: { has: obj => "incrementalSync" in obj, get: obj => obj.incrementalSync }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _backfill_decorators, { kind: "method", name: "backfill", static: false, private: false, access: { has: obj => "backfill" in obj, get: obj => obj.backfill }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getHistory_decorators, { kind: "method", name: "getHistory", static: false, private: false, access: { has: obj => "getHistory" in obj, get: obj => obj.getHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            InsightsController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        engine = __runInitializers(this, _instanceExtraInitializers);
        prisma;
        constructor(engine, prisma) {
            this.engine = engine;
            this.prisma = prisma;
        }
        async getSyncStatus(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.prisma.automationInsightsSyncCursor.findMany({
                where: { workspaceId },
            });
        }
        async fullSync(provider, req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.engine.triggerSync(workspaceId, provider, 'FULL_SYNC');
        }
        async incrementalSync(provider, req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.engine.triggerSync(workspaceId, provider, 'INCREMENTAL_SYNC');
        }
        async backfill(provider, req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.engine.triggerSync(workspaceId, provider, 'HISTORICAL_BACKFILL');
        }
        async getHistory(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.prisma.automationInsightsSyncRun.findMany({
                where: { workspaceId },
                orderBy: { startedAt: 'desc' },
            });
        }
    };
    return InsightsController = _classThis;
})();
exports.InsightsController = InsightsController;
//# sourceMappingURL=insights.controller.js.map