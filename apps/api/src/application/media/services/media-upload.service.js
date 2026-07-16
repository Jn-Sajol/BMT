"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaUploadService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const media_mapper_1 = require("../common/media.mapper");
let MediaUploadService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MediaUploadService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MediaUploadService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        mediaRepo;
        connectionRepo;
        campaignRepo;
        adAccountRepo;
        validationService;
        uploader;
        historyService;
        clockProvider;
        encryptionService;
        constructor(mediaRepo, connectionRepo, campaignRepo, adAccountRepo, validationService, uploader, historyService, clockProvider, encryptionService) {
            this.mediaRepo = mediaRepo;
            this.connectionRepo = connectionRepo;
            this.campaignRepo = campaignRepo;
            this.adAccountRepo = adAccountRepo;
            this.validationService = validationService;
            this.uploader = uploader;
            this.historyService = historyService;
            this.clockProvider = clockProvider;
            this.encryptionService = encryptionService;
        }
        async createFolder(dto, workspaceId) {
            const now = this.clockProvider.now();
            const folder = {
                id: '',
                workspaceId,
                parentId: dto.parentId || null,
                name: dto.name,
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
            };
            const saved = await this.mediaRepo.saveFolder(folder);
            return media_mapper_1.MediaMapper.toFolderResponse(saved);
        }
        async upload(fileBuffer, originalFilename, mimeType, workspaceId, userId, folderId) {
            this.validationService.validateFile(originalFilename, mimeType, fileBuffer.length);
            const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');
            const existing = await this.mediaRepo.findByChecksum(checksum, workspaceId);
            if (existing) {
                return media_mapper_1.MediaMapper.toAssetResponse(existing);
            }
            const key = `workspaces/${workspaceId}/assets/${checksum}-${originalFilename}`;
            const publicUrl = `https://cdn.jnsmarketing.org/${key}`;
            const dotIndex = originalFilename.lastIndexOf('.');
            const extension = originalFilename.substring(dotIndex).toLowerCase();
            const now = this.clockProvider.now();
            const isImage = mimeType.startsWith('image/');
            const asset = {
                id: '',
                workspaceId,
                folderId: folderId || null,
                type: isImage ? 'IMAGE' : 'VIDEO',
                name: originalFilename,
                originalFilename,
                mimeType,
                extension,
                size: fileBuffer.length,
                width: null,
                height: null,
                duration: null,
                storageProvider: 'MOCK',
                storageKey: key,
                publicUrl,
                thumbnailUrl: isImage ? publicUrl : null,
                metaImageHash: null,
                metaVideoId: null,
                processingStatus: isImage ? 'COMPLETED' : 'PENDING',
                uploadStatus: 'PENDING',
                checksum,
                metadata: {},
                createdBy: userId,
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
            };
            const savedAsset = await this.mediaRepo.saveAsset(asset);
            const connection = await this.connectionRepo.findByWorkspaceId(workspaceId);
            if (connection && connection.status === 'ACTIVE') {
                const token = this.encryptionService.decrypt(connection.encryptedAccessToken);
                if (token) {
                    const accounts = await this.adAccountRepo.findByWorkspaceId(workspaceId);
                    const activeAccount = accounts.find((a) => a.status === 'ACTIVE');
                    if (activeAccount) {
                        try {
                            if (isImage) {
                                const res = await this.uploader.uploadImage(fileBuffer, originalFilename, mimeType, token, activeAccount.externalId);
                                savedAsset.metaImageHash = res.metaImageHash || null;
                                savedAsset.uploadStatus = 'UPLOADED';
                                savedAsset.metadata = res.rawResponse;
                            }
                            else {
                                const res = await this.uploader.uploadVideo(fileBuffer, originalFilename, mimeType, token, activeAccount.externalId);
                                savedAsset.metaVideoId = res.metaVideoId || null;
                                savedAsset.uploadStatus = 'UPLOADED';
                                savedAsset.processingStatus = 'PROCESSING';
                                savedAsset.metadata = res.rawResponse;
                            }
                            await this.mediaRepo.saveAsset(savedAsset);
                        }
                        catch (err) {
                            savedAsset.uploadStatus = 'FAILED';
                            await this.mediaRepo.saveAsset(savedAsset);
                        }
                    }
                }
            }
            await this.historyService.createSnapshot(savedAsset, userId, 1);
            return media_mapper_1.MediaMapper.toAssetResponse(savedAsset);
        }
        async getFolders(workspaceId) {
            const folders = await this.mediaRepo.findFoldersByWorkspaceId(workspaceId);
            return folders.map(media_mapper_1.MediaMapper.toFolderResponse);
        }
        async getAssets(workspaceId) {
            const assets = await this.mediaRepo.findByWorkspaceId(workspaceId);
            return assets.map(media_mapper_1.MediaMapper.toAssetResponse);
        }
        async deleteAsset(id, workspaceId) {
            const asset = await this.mediaRepo.findById(id);
            if (!asset || asset.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Media Asset not found');
            }
            asset.deletedAt = this.clockProvider.now();
            await this.mediaRepo.saveAsset(asset);
        }
        async deleteFolder(id, workspaceId) {
            const folder = await this.mediaRepo.findFolderById(id);
            if (!folder || folder.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Media Folder not found');
            }
            folder.deletedAt = this.clockProvider.now();
            await this.mediaRepo.saveFolder(folder);
        }
    };
    return MediaUploadService = _classThis;
})();
exports.MediaUploadService = MediaUploadService;
//# sourceMappingURL=media-upload.service.js.map