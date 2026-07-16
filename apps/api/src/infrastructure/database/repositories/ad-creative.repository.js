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
exports.AdCreativeRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_error_mapper_1 = require("../prisma-error.mapper");
let AdCreativeRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdCreativeRepository = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdCreativeRepository = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        constructor(prisma) {
            this.prisma = prisma;
        }
        async findById(id) {
            try {
                return await this.prisma.adCreative.findFirst({
                    where: { id, deletedAt: null },
                    include: { labels: true, tags: true },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findByCampaignId(campaignId) {
            try {
                return await this.prisma.adCreative.findMany({
                    where: { campaignId, deletedAt: null },
                    include: { labels: true, tags: true },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async save(entity, labels = [], tags = []) {
            try {
                return await this.prisma.$transaction(async (tx) => {
                    const saved = await tx.adCreative.upsert({
                        where: { id: entity.id || '' },
                        update: {
                            creativeType: entity.creativeType,
                            name: entity.name,
                            primaryText: entity.primaryText,
                            headline: entity.headline,
                            description: entity.description,
                            callToAction: entity.callToAction,
                            destinationUrl: entity.destinationUrl,
                            displayLink: entity.displayLink,
                            caption: entity.caption,
                            linkDescription: entity.linkDescription,
                            facebookPageId: entity.facebookPageId,
                            instagramAccountId: entity.instagramAccountId,
                            mediaType: entity.mediaType,
                            mediaAssetId: entity.mediaAssetId,
                            thumbnailAssetId: entity.thumbnailAssetId,
                            pixelId: entity.pixelId,
                            trackingParameters: entity.trackingParameters,
                            creativeSpec: entity.creativeSpec,
                            status: entity.status,
                            draftVersion: entity.draftVersion,
                            updatedBy: entity.updatedBy,
                            deletedAt: entity.deletedAt,
                            publishedAt: entity.publishedAt,
                            publishedBy: entity.publishedBy,
                            externalCreativeId: entity.externalCreativeId,
                            publishResponse: entity.publishResponse || undefined,
                        },
                        create: {
                            campaignId: entity.campaignId,
                            creativeType: entity.creativeType,
                            name: entity.name,
                            primaryText: entity.primaryText,
                            headline: entity.headline,
                            description: entity.description,
                            callToAction: entity.callToAction,
                            destinationUrl: entity.destinationUrl,
                            displayLink: entity.displayLink,
                            caption: entity.caption,
                            linkDescription: entity.linkDescription,
                            facebookPageId: entity.facebookPageId,
                            instagramAccountId: entity.instagramAccountId,
                            mediaType: entity.mediaType,
                            mediaAssetId: entity.mediaAssetId,
                            thumbnailAssetId: entity.thumbnailAssetId,
                            pixelId: entity.pixelId,
                            trackingParameters: entity.trackingParameters,
                            creativeSpec: entity.creativeSpec,
                            status: entity.status,
                            draftVersion: entity.draftVersion,
                            createdBy: entity.createdBy,
                            updatedBy: entity.updatedBy,
                            deletedAt: entity.deletedAt,
                            publishedAt: entity.publishedAt,
                            publishedBy: entity.publishedBy,
                            externalCreativeId: entity.externalCreativeId,
                            publishResponse: entity.publishResponse || undefined,
                        },
                    });
                    // Re-create labels
                    await tx.adCreativeLabel.deleteMany({ where: { adCreativeId: saved.id } });
                    if (labels.length > 0) {
                        await tx.adCreativeLabel.createMany({
                            data: labels.map((name) => ({ adCreativeId: saved.id, name })),
                        });
                    }
                    // Re-create tags
                    await tx.adCreativeTag.deleteMany({ where: { adCreativeId: saved.id } });
                    if (tags.length > 0) {
                        await tx.adCreativeTag.createMany({
                            data: tags.map((name) => ({ adCreativeId: saved.id, name })),
                        });
                    }
                    return await tx.adCreative.findFirstOrThrow({
                        where: { id: saved.id },
                        include: { labels: true, tags: true },
                    });
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async saveHistory(history) {
            try {
                return await this.prisma.adCreativeHistory.create({
                    data: {
                        adCreativeId: history.adCreativeId,
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
        async findHistoryByAdCreativeId(adCreativeId) {
            try {
                return await this.prisma.adCreativeHistory.findMany({
                    where: { adCreativeId },
                    orderBy: { version: 'desc' },
                    include: { author: true },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findHistoryByAdCreativeIdAndVersion(adCreativeId, version) {
            try {
                return await this.prisma.adCreativeHistory.findFirst({
                    where: { adCreativeId, version },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
    };
    return AdCreativeRepository = _classThis;
})();
exports.AdCreativeRepository = AdCreativeRepository;
//# sourceMappingURL=ad-creative.repository.js.map