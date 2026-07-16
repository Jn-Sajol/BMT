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
exports.MetaAuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let MetaAuthController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Meta Integration'), (0, common_1.Controller)({ path: 'meta', version: '1' }), (0, common_1.UseGuards)(auth_guard_1.AuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _connect_decorators;
    let _callback_decorators;
    let _disconnect_decorators;
    let _status_decorators;
    let _sync_decorators;
    let _getBusinesses_decorators;
    let _getPages_decorators;
    let _getAdAccounts_decorators;
    let _getInstagram_decorators;
    let _getPixels_decorators;
    let _getCatalogs_decorators;
    let _syncRelationships_decorators;
    let _getBusinessRelationships_decorators;
    let _getPageRelationships_decorators;
    let _getAdAccountRelationships_decorators;
    var MetaAuthController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _connect_decorators = [(0, common_1.Get)('connect'), (0, swagger_1.ApiOperation)({ summary: 'Initiate Meta OAuth connect flow' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }), (0, swagger_1.ApiHeader)({ name: 'x-organization-id', required: true })];
            _callback_decorators = [(0, common_1.Get)('callback'), (0, swagger_1.ApiOperation)({ summary: 'Facebook OAuth callback redirect handler' })];
            _disconnect_decorators = [(0, common_1.Post)('disconnect'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Disconnect Meta connection from current workspace' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _status_decorators = [(0, common_1.Get)('status'), (0, swagger_1.ApiOperation)({ summary: 'Fetch Meta connection status for current workspace' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _sync_decorators = [(0, common_1.Post)('sync'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Trigger discovery sync of Meta assets' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getBusinesses_decorators = [(0, common_1.Get)('businesses'), (0, swagger_1.ApiOperation)({ summary: 'Get discovered Meta Businesses for workspace' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getPages_decorators = [(0, common_1.Get)('pages'), (0, swagger_1.ApiOperation)({ summary: 'Get discovered Meta Pages for workspace' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getAdAccounts_decorators = [(0, common_1.Get)('adaccounts'), (0, swagger_1.ApiOperation)({ summary: 'Get discovered Meta Ad Accounts for workspace' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getInstagram_decorators = [(0, common_1.Get)('instagram'), (0, swagger_1.ApiOperation)({ summary: 'Get discovered Instagram Accounts for workspace' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getPixels_decorators = [(0, common_1.Get)('pixels'), (0, swagger_1.ApiOperation)({ summary: 'Get discovered Meta Pixels for workspace' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getCatalogs_decorators = [(0, common_1.Get)('catalogs'), (0, swagger_1.ApiOperation)({ summary: 'Get discovered Meta Catalogs for workspace' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _syncRelationships_decorators = [(0, common_1.Post)('sync-relationships'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Trigger sync of Meta asset relationships' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getBusinessRelationships_decorators = [(0, common_1.Get)('relationships/businesses'), (0, swagger_1.ApiOperation)({ summary: 'Get discovered Meta Business Page relationships for workspace' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getPageRelationships_decorators = [(0, common_1.Get)('relationships/pages'), (0, swagger_1.ApiOperation)({ summary: 'Get discovered Meta Page Instagram relationships for workspace' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getAdAccountRelationships_decorators = [(0, common_1.Get)('relationships/adaccounts'), (0, swagger_1.ApiOperation)({ summary: 'Get discovered Meta Ad Account Pixel relationships for workspace' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            __esDecorate(this, null, _connect_decorators, { kind: "method", name: "connect", static: false, private: false, access: { has: obj => "connect" in obj, get: obj => obj.connect }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _callback_decorators, { kind: "method", name: "callback", static: false, private: false, access: { has: obj => "callback" in obj, get: obj => obj.callback }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _disconnect_decorators, { kind: "method", name: "disconnect", static: false, private: false, access: { has: obj => "disconnect" in obj, get: obj => obj.disconnect }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _status_decorators, { kind: "method", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _sync_decorators, { kind: "method", name: "sync", static: false, private: false, access: { has: obj => "sync" in obj, get: obj => obj.sync }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getBusinesses_decorators, { kind: "method", name: "getBusinesses", static: false, private: false, access: { has: obj => "getBusinesses" in obj, get: obj => obj.getBusinesses }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getPages_decorators, { kind: "method", name: "getPages", static: false, private: false, access: { has: obj => "getPages" in obj, get: obj => obj.getPages }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getAdAccounts_decorators, { kind: "method", name: "getAdAccounts", static: false, private: false, access: { has: obj => "getAdAccounts" in obj, get: obj => obj.getAdAccounts }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getInstagram_decorators, { kind: "method", name: "getInstagram", static: false, private: false, access: { has: obj => "getInstagram" in obj, get: obj => obj.getInstagram }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getPixels_decorators, { kind: "method", name: "getPixels", static: false, private: false, access: { has: obj => "getPixels" in obj, get: obj => obj.getPixels }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getCatalogs_decorators, { kind: "method", name: "getCatalogs", static: false, private: false, access: { has: obj => "getCatalogs" in obj, get: obj => obj.getCatalogs }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _syncRelationships_decorators, { kind: "method", name: "syncRelationships", static: false, private: false, access: { has: obj => "syncRelationships" in obj, get: obj => obj.syncRelationships }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getBusinessRelationships_decorators, { kind: "method", name: "getBusinessRelationships", static: false, private: false, access: { has: obj => "getBusinessRelationships" in obj, get: obj => obj.getBusinessRelationships }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getPageRelationships_decorators, { kind: "method", name: "getPageRelationships", static: false, private: false, access: { has: obj => "getPageRelationships" in obj, get: obj => obj.getPageRelationships }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getAdAccountRelationships_decorators, { kind: "method", name: "getAdAccountRelationships", static: false, private: false, access: { has: obj => "getAdAccountRelationships" in obj, get: obj => obj.getAdAccountRelationships }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MetaAuthController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        metaAuthService = __runInitializers(this, _instanceExtraInitializers);
        syncService;
        businessService;
        pageService;
        adAccountService;
        instagramService;
        pixelService;
        catalogService;
        relSyncService;
        businessRelService;
        pageRelService;
        adAccountRelService;
        constructor(metaAuthService, syncService, businessService, pageService, adAccountService, instagramService, pixelService, catalogService, relSyncService, businessRelService, pageRelService, adAccountRelService) {
            this.metaAuthService = metaAuthService;
            this.syncService = syncService;
            this.businessService = businessService;
            this.pageService = pageService;
            this.adAccountService = adAccountService;
            this.instagramService = instagramService;
            this.pixelService = pixelService;
            this.catalogService = catalogService;
            this.relSyncService = relSyncService;
            this.businessRelService = businessRelService;
            this.pageRelService = pageRelService;
            this.adAccountRelService = adAccountRelService;
        }
        async connect(req) {
            const workspaceId = req.headers['x-workspace-id'];
            const organizationId = req.headers['x-organization-id'];
            const userId = req.user.id;
            return await this.metaAuthService.connect(workspaceId, organizationId, userId);
        }
        async callback(code, state, req) {
            const userId = req.user.id;
            return await this.metaAuthService.callback(code, state, userId);
        }
        async disconnect(req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            return await this.metaAuthService.disconnect(workspaceId, userId);
        }
        async status(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.metaAuthService.status(workspaceId);
        }
        async sync(req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            return await this.syncService.sync(workspaceId, userId);
        }
        async getBusinesses(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.businessService.getByWorkspace(workspaceId);
        }
        async getPages(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.pageService.getByWorkspace(workspaceId);
        }
        async getAdAccounts(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.adAccountService.getByWorkspace(workspaceId);
        }
        async getInstagram(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.instagramService.getByWorkspace(workspaceId);
        }
        async getPixels(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.pixelService.getByWorkspace(workspaceId);
        }
        async getCatalogs(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.catalogService.getByWorkspace(workspaceId);
        }
        async syncRelationships(req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            return await this.relSyncService.syncRelationships(workspaceId, userId);
        }
        async getBusinessRelationships(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.businessRelService.getByWorkspace(workspaceId);
        }
        async getPageRelationships(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.pageRelService.getByWorkspace(workspaceId);
        }
        async getAdAccountRelationships(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.adAccountRelService.getByWorkspace(workspaceId);
        }
    };
    return MetaAuthController = _classThis;
})();
exports.MetaAuthController = MetaAuthController;
//# sourceMappingURL=meta-auth.controller.js.map