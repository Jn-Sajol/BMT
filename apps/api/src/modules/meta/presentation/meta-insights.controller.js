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
exports.MetaInsightsController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let MetaInsightsController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Meta Insights & Performance'), (0, common_1.Controller)({ path: 'meta/insights', version: '1' }), (0, common_1.UseGuards)(auth_guard_1.AuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _sync_decorators;
    let _getCampaigns_decorators;
    let _getAdSets_decorators;
    let _getAds_decorators;
    var MetaInsightsController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _sync_decorators = [(0, common_1.Post)('sync'), (0, swagger_1.ApiOperation)({ summary: 'Synchronize Meta insights metrics' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getCampaigns_decorators = [(0, common_1.Get)('campaigns'), (0, swagger_1.ApiOperation)({ summary: 'Retrieve Campaign Performance Insights' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getAdSets_decorators = [(0, common_1.Get)('adsets'), (0, swagger_1.ApiOperation)({ summary: 'Retrieve AdSet Performance Insights' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getAds_decorators = [(0, common_1.Get)('ads'), (0, swagger_1.ApiOperation)({ summary: 'Retrieve Ad Performance Insights' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            __esDecorate(this, null, _sync_decorators, { kind: "method", name: "sync", static: false, private: false, access: { has: obj => "sync" in obj, get: obj => obj.sync }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getCampaigns_decorators, { kind: "method", name: "getCampaigns", static: false, private: false, access: { has: obj => "getCampaigns" in obj, get: obj => obj.getCampaigns }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getAdSets_decorators, { kind: "method", name: "getAdSets", static: false, private: false, access: { has: obj => "getAdSets" in obj, get: obj => obj.getAdSets }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getAds_decorators, { kind: "method", name: "getAds", static: false, private: false, access: { has: obj => "getAds" in obj, get: obj => obj.getAds }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MetaInsightsController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        insightsService = __runInitializers(this, _instanceExtraInitializers);
        syncService;
        constructor(insightsService, syncService) {
            this.insightsService = insightsService;
            this.syncService = syncService;
        }
        async sync(dto, req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.syncService.sync(dto, workspaceId);
        }
        async getCampaigns(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.insightsService.getCampaignInsights(workspaceId);
        }
        async getAdSets(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.insightsService.getAdSetInsights(workspaceId);
        }
        async getAds(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.insightsService.getAdInsights(workspaceId);
        }
    };
    return MetaInsightsController = _classThis;
})();
exports.MetaInsightsController = MetaInsightsController;
//# sourceMappingURL=meta-insights.controller.js.map