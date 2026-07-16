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
exports.AdLifecycleController = void 0;
const common_1 = require("@nestjs/common");
const ad_lifecycle_dto_1 = require("../application/services/ad-lifecycle.dto");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let AdLifecycleController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Ad Lifecycle Management'), (0, common_1.Controller)({ path: 'ads', version: '1' }), (0, common_1.UseGuards)(auth_guard_1.AuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _updateAd_decorators;
    let _pauseAd_decorators;
    let _resumeAd_decorators;
    let _archiveAd_decorators;
    var AdLifecycleController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _updateAd_decorators = [(0, common_1.Patch)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update a published Ad attributes on Facebook' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }), (0, swagger_1.ApiBody)({ type: ad_lifecycle_dto_1.UpdateAdDto })];
            _pauseAd_decorators = [(0, common_1.Patch)(':id/pause'), (0, swagger_1.ApiOperation)({ summary: 'Pause a published Ad on Facebook' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _resumeAd_decorators = [(0, common_1.Patch)(':id/resume'), (0, swagger_1.ApiOperation)({ summary: 'Resume a paused Ad on Facebook' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _archiveAd_decorators = [(0, common_1.Patch)(':id/archive'), (0, swagger_1.ApiOperation)({ summary: 'Archive a published Ad on Facebook' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            __esDecorate(this, null, _updateAd_decorators, { kind: "method", name: "updateAd", static: false, private: false, access: { has: obj => "updateAd" in obj, get: obj => obj.updateAd }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _pauseAd_decorators, { kind: "method", name: "pauseAd", static: false, private: false, access: { has: obj => "pauseAd" in obj, get: obj => obj.pauseAd }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _resumeAd_decorators, { kind: "method", name: "resumeAd", static: false, private: false, access: { has: obj => "resumeAd" in obj, get: obj => obj.resumeAd }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _archiveAd_decorators, { kind: "method", name: "archiveAd", static: false, private: false, access: { has: obj => "archiveAd" in obj, get: obj => obj.archiveAd }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdLifecycleController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        lifecycleService = __runInitializers(this, _instanceExtraInitializers);
        constructor(lifecycleService) {
            this.lifecycleService = lifecycleService;
        }
        async updateAd(adId, dto, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            return await this.lifecycleService.updateAd(adId, workspaceId, userId, dto);
        }
        async pauseAd(adId, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            return await this.lifecycleService.pauseAd(adId, workspaceId, userId);
        }
        async resumeAd(adId, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            return await this.lifecycleService.resumeAd(adId, workspaceId, userId);
        }
        async archiveAd(adId, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            return await this.lifecycleService.archiveAd(adId, workspaceId, userId);
        }
    };
    return AdLifecycleController = _classThis;
})();
exports.AdLifecycleController = AdLifecycleController;
//# sourceMappingURL=ad-lifecycle.controller.js.map