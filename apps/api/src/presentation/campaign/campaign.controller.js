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
exports.CampaignController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../common/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let CampaignController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Campaigns'), (0, common_1.Controller)({ path: 'campaigns', version: '1' }), (0, common_1.UseGuards)(auth_guard_1.AuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _findAll_decorators;
    let _findOne_decorators;
    let _update_decorators;
    let _remove_decorators;
    let _duplicate_decorators;
    let _restore_decorators;
    let _getHistory_decorators;
    var CampaignController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _create_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiOperation)({ summary: 'Create campaign draft' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }), (0, swagger_1.ApiHeader)({ name: 'x-organization-id', required: true })];
            _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Get all campaign drafts for current workspace' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get campaign details by ID' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _update_decorators = [(0, common_1.Patch)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update campaign draft details' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _remove_decorators = [(0, common_1.Delete)(':id'), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT), (0, swagger_1.ApiOperation)({ summary: 'Soft delete campaign draft' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _duplicate_decorators = [(0, common_1.Post)(':id/duplicate'), (0, swagger_1.ApiOperation)({ summary: 'Duplicate campaign draft' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _restore_decorators = [(0, common_1.Post)(':id/restore'), (0, swagger_1.ApiOperation)({ summary: 'Restore campaign details to a specific snapshot version' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getHistory_decorators = [(0, common_1.Get)(':id/history'), (0, swagger_1.ApiOperation)({ summary: 'Get version snapshot history for campaign' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            __esDecorate(this, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: obj => "findAll" in obj, get: obj => obj.findAll }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: obj => "remove" in obj, get: obj => obj.remove }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _duplicate_decorators, { kind: "method", name: "duplicate", static: false, private: false, access: { has: obj => "duplicate" in obj, get: obj => obj.duplicate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _restore_decorators, { kind: "method", name: "restore", static: false, private: false, access: { has: obj => "restore" in obj, get: obj => obj.restore }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getHistory_decorators, { kind: "method", name: "getHistory", static: false, private: false, access: { has: obj => "getHistory" in obj, get: obj => obj.getHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CampaignController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        campaignService = __runInitializers(this, _instanceExtraInitializers);
        historyService;
        constructor(campaignService, historyService) {
            this.campaignService = campaignService;
            this.historyService = historyService;
        }
        async create(dto, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const organizationId = req.headers['x-organization-id'];
            const userId = req.user.id;
            return await this.campaignService.create(dto, workspaceId, organizationId, userId);
        }
        async findAll(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.campaignService.findAll(workspaceId);
        }
        async findOne(id, req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.campaignService.findOne(id, workspaceId);
        }
        async update(id, dto, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            return await this.campaignService.update(id, dto, workspaceId, userId);
        }
        async remove(id, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            await this.campaignService.delete(id, workspaceId, userId);
        }
        async duplicate(id, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            return await this.campaignService.duplicate(id, workspaceId, userId);
        }
        async restore(id, versionStr, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            const version = parseInt(versionStr, 10);
            return await this.campaignService.restore(id, version, workspaceId, userId);
        }
        async getHistory(id) {
            return await this.historyService.getHistory(id);
        }
    };
    return CampaignController = _classThis;
})();
exports.CampaignController = CampaignController;
//# sourceMappingURL=campaign.controller.js.map