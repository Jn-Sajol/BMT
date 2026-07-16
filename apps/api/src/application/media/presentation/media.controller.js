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
exports.MediaController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let MediaController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Media Library'), (0, common_1.Controller)({ path: 'media', version: '1' }), (0, common_1.UseGuards)(auth_guard_1.AuthGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createFolder_decorators;
    let _getFolders_decorators;
    let _deleteFolder_decorators;
    let _uploadFile_decorators;
    let _getAssets_decorators;
    let _deleteAsset_decorators;
    var MediaController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _createFolder_decorators = [(0, common_1.Post)('folders'), (0, swagger_1.ApiOperation)({ summary: 'Create Media folder' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getFolders_decorators = [(0, common_1.Get)('folders'), (0, swagger_1.ApiOperation)({ summary: 'List Media folders' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _deleteFolder_decorators = [(0, common_1.Delete)('folders/:id'), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT), (0, swagger_1.ApiOperation)({ summary: 'Soft delete Media folder' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _uploadFile_decorators = [(0, common_1.Post)('upload'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiOperation)({ summary: 'Upload file to Media library and sync to Meta' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _getAssets_decorators = [(0, common_1.Get)('assets'), (0, swagger_1.ApiOperation)({ summary: 'List Media assets' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            _deleteAsset_decorators = [(0, common_1.Delete)('assets/:id'), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT), (0, swagger_1.ApiOperation)({ summary: 'Soft delete Media asset' }), (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true })];
            __esDecorate(this, null, _createFolder_decorators, { kind: "method", name: "createFolder", static: false, private: false, access: { has: obj => "createFolder" in obj, get: obj => obj.createFolder }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getFolders_decorators, { kind: "method", name: "getFolders", static: false, private: false, access: { has: obj => "getFolders" in obj, get: obj => obj.getFolders }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _deleteFolder_decorators, { kind: "method", name: "deleteFolder", static: false, private: false, access: { has: obj => "deleteFolder" in obj, get: obj => obj.deleteFolder }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _uploadFile_decorators, { kind: "method", name: "uploadFile", static: false, private: false, access: { has: obj => "uploadFile" in obj, get: obj => obj.uploadFile }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getAssets_decorators, { kind: "method", name: "getAssets", static: false, private: false, access: { has: obj => "getAssets" in obj, get: obj => obj.getAssets }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _deleteAsset_decorators, { kind: "method", name: "deleteAsset", static: false, private: false, access: { has: obj => "deleteAsset" in obj, get: obj => obj.deleteAsset }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MediaController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        mediaService = __runInitializers(this, _instanceExtraInitializers);
        constructor(mediaService) {
            this.mediaService = mediaService;
        }
        async createFolder(dto, req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.mediaService.createFolder(dto, workspaceId);
        }
        async getFolders(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.mediaService.getFolders(workspaceId);
        }
        async deleteFolder(id, req) {
            const workspaceId = req.headers['x-workspace-id'];
            await this.mediaService.deleteFolder(id, workspaceId);
        }
        async uploadFile(file, req) {
            const workspaceId = req.headers['x-workspace-id'];
            const userId = req.user.id;
            const folderId = req.body.folderId;
            return await this.mediaService.upload(file.buffer, file.originalname, file.mimetype, workspaceId, userId, folderId);
        }
        async getAssets(req) {
            const workspaceId = req.headers['x-workspace-id'];
            return await this.mediaService.getAssets(workspaceId);
        }
        async deleteAsset(id, req) {
            const workspaceId = req.headers['x-workspace-id'];
            await this.mediaService.deleteAsset(id, workspaceId);
        }
    };
    return MediaController = _classThis;
})();
exports.MediaController = MediaController;
//# sourceMappingURL=media.controller.js.map