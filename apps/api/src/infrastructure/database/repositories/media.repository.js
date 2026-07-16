"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_error_mapper_1 = require("../prisma-error.mapper");
let MediaRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MediaRepository = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MediaRepository = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        constructor(prisma) {
            this.prisma = prisma;
        }
        async findById(id) {
            try {
                return await this.prisma.mediaAsset.findFirst({
                    where: { id, deletedAt: null },
                    include: { tags: true },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findByWorkspaceId(workspaceId) {
            try {
                return await this.prisma.mediaAsset.findMany({
                    where: { workspaceId, deletedAt: null },
                    include: { tags: true },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findByChecksum(checksum, workspaceId) {
            try {
                return await this.prisma.mediaAsset.findFirst({
                    where: { checksum, workspaceId, deletedAt: null },
                    include: { tags: true },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findFolderById(id) {
            try {
                return await this.prisma.mediaFolder.findFirst({
                    where: { id, deletedAt: null },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findFoldersByWorkspaceId(workspaceId) {
            try {
                return await this.prisma.mediaFolder.findMany({
                    where: { workspaceId, deletedAt: null },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async saveFolder(entity) {
            try {
                return await this.prisma.mediaFolder.upsert({
                    where: { id: entity.id || '' },
                    update: {
                        name: entity.name,
                        parentId: entity.parentId,
                        deletedAt: entity.deletedAt,
                    },
                    create: {
                        workspaceId: entity.workspaceId,
                        parentId: entity.parentId,
                        name: entity.name,
                        deletedAt: entity.deletedAt,
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async saveAsset(entity, tags = []) {
            try {
                return await this.prisma.$transaction(async (tx) => {
                    const saved = await tx.mediaAsset.upsert({
                        where: { id: entity.id || '' },
                        update: {
                            folderId: entity.folderId,
                            type: entity.type,
                            name: entity.name,
                            originalFilename: entity.originalFilename,
                            mimeType: entity.mimeType,
                            extension: entity.extension,
                            size: entity.size,
                            width: entity.width,
                            height: entity.height,
                            duration: entity.duration,
                            storageProvider: entity.storageProvider,
                            storageKey: entity.storageKey,
                            publicUrl: entity.publicUrl,
                            thumbnailUrl: entity.thumbnailUrl,
                            metaImageHash: entity.metaImageHash,
                            metaVideoId: entity.metaVideoId,
                            processingStatus: entity.processingStatus,
                            uploadStatus: entity.uploadStatus,
                            checksum: entity.checksum,
                            metadata: entity.metadata,
                            deletedAt: entity.deletedAt,
                        },
                        create: {
                            workspaceId: entity.workspaceId,
                            folderId: entity.folderId,
                            type: entity.type,
                            name: entity.name,
                            originalFilename: entity.originalFilename,
                            mimeType: entity.mimeType,
                            extension: entity.extension,
                            size: entity.size,
                            width: entity.width,
                            height: entity.height,
                            duration: entity.duration,
                            storageProvider: entity.storageProvider,
                            storageKey: entity.storageKey,
                            publicUrl: entity.publicUrl,
                            thumbnailUrl: entity.thumbnailUrl,
                            metaImageHash: entity.metaImageHash,
                            metaVideoId: entity.metaVideoId,
                            processingStatus: entity.processingStatus,
                            uploadStatus: entity.uploadStatus,
                            checksum: entity.checksum,
                            metadata: entity.metadata,
                            createdBy: entity.createdBy,
                            deletedAt: entity.deletedAt,
                        },
                    });
                    await tx.mediaTag.deleteMany({ where: { mediaAssetId: saved.id } });
                    if (tags.length > 0) {
                        await tx.mediaTag.createMany({
                            data: tags.map((name) => ({ mediaAssetId: saved.id, name })),
                        });
                    }
                    return await tx.mediaAsset.findFirstOrThrow({
                        where: { id: saved.id },
                        include: { tags: true },
                    });
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async saveHistory(history) {
            try {
                return await this.prisma.mediaHistory.create({
                    data: {
                        mediaAssetId: history.mediaAssetId,
                        version: history.version,
                        snapshot: history.snapshot,
                        authorId: history.authorId,
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findHistoryByAssetId(mediaAssetId) {
            try {
                return await this.prisma.mediaHistory.findMany({
                    where: { mediaAssetId },
                    orderBy: { version: 'desc' },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
    };
    return MediaRepository = _classThis;
})();
exports.MediaRepository = MediaRepository;
//# sourceMappingURL=media.repository.js.map