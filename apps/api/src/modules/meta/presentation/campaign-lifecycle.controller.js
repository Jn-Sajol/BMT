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
exports.CampaignLifecycleController = void 0;
const common_1 = require("@nestjs/common");
const campaign_lifecycle_dto_1 = require("../application/services/campaign-lifecycle.dto");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let CampaignLifecycleController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Campaign Lifecycle Management'), (0, common_1.Controller)({ path: 'campaigns', version: '1' }), (0, common_1.UseGuards)(auth_guard_1.AuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _updateCampaign_decorators;
    let _pauseCampaign_decorators;
    let _resumeCampaign_decorators;
    let _archiveCampaign_decorators;
    var CampaignLifecycleController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _updateCampaign_decorators = [(0, common_1.Patch)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update a published Campaign attributes on Facebook' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }), (0, swagger_1.ApiBody)({ type: campaign_lifecycle_dto_1.UpdateCampaignDto })];
            _pauseCampaign_decorators = [(0, common_1.Patch)(':id/pause'), (0, swagger_1.ApiOperation)({ summary: 'Pause a published Campaign on Facebook' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _resumeCampaign_decorators = [(0, common_1.Patch)(':id/resume'), (0, swagger_1.ApiOperation)({ summary: 'Resume a paused Campaign on Facebook' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _archiveCampaign_decorators = [(0, common_1.Patch)(':id/archive'), (0, swagger_1.ApiOperation)({ summary: 'Archive a published Campaign on Facebook' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            __esDecorate(this, null, _updateCampaign_decorators, { kind: "method", name: "updateCampaign", static: false, private: false, access: { has: obj => "updateCampaign" in obj, get: obj => obj.updateCampaign }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _pauseCampaign_decorators, { kind: "method", name: "pauseCampaign", static: false, private: false, access: { has: obj => "pauseCampaign" in obj, get: obj => obj.pauseCampaign }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _resumeCampaign_decorators, { kind: "method", name: "resumeCampaign", static: false, private: false, access: { has: obj => "resumeCampaign" in obj, get: obj => obj.resumeCampaign }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _archiveCampaign_decorators, { kind: "method", name: "archiveCampaign", static: false, private: false, access: { has: obj => "archiveCampaign" in obj, get: obj => obj.archiveCampaign }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CampaignLifecycleController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        lifecycleService = __runInitializers(this, _instanceExtraInitializers);
        constructor(lifecycleService) {
            this.lifecycleService = lifecycleService;
        }
        async updateCampaign(campaignId, dto, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            return await this.lifecycleService.updateCampaign(campaignId, workspaceId, userId, dto);
        }
        async pauseCampaign(campaignId, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            return await this.lifecycleService.pauseCampaign(campaignId, workspaceId, userId);
        }
        async resumeCampaign(campaignId, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            return await this.lifecycleService.resumeCampaign(campaignId, workspaceId, userId);
        }
        async archiveCampaign(campaignId, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            return await this.lifecycleService.archiveCampaign(campaignId, workspaceId, userId);
        }
    };
    return CampaignLifecycleController = _classThis;
})();
exports.CampaignLifecycleController = CampaignLifecycleController;
//# sourceMappingURL=campaign-lifecycle.controller.js.map