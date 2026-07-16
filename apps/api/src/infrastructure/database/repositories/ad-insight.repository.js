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
exports.AdInsightRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_error_mapper_1 = require("../prisma-error.mapper");
let AdInsightRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdInsightRepository = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdInsightRepository = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        constructor(prisma) {
            this.prisma = prisma;
        }
        async findById(id) {
            try {
                return await this.prisma.adInsight.findUnique({ where: { id } });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findByWorkspaceId(workspaceId) {
            try {
                return await this.prisma.adInsight.findMany({ where: { workspaceId } });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async upsert(entity) {
            try {
                const existing = await this.prisma.adInsight.findUnique({
                    where: {
                        workspace_ad_object_date_provider: {
                            workspaceId: entity.workspaceId,
                            facebookObjectId: entity.facebookObjectId,
                            date: entity.date,
                            provider: entity.provider,
                        },
                    },
                });
                const insight = await this.prisma.adInsight.upsert({
                    where: {
                        workspace_ad_object_date_provider: {
                            workspaceId: entity.workspaceId,
                            facebookObjectId: entity.facebookObjectId,
                            date: entity.date,
                            provider: entity.provider,
                        },
                    },
                    update: {
                        impressions: entity.impressions,
                        reach: entity.reach,
                        frequency: entity.frequency,
                        clicks: entity.clicks,
                        uniqueClicks: entity.uniqueClicks,
                        inlineLinkClicks: entity.inlineLinkClicks,
                        ctr: entity.ctr,
                        cpc: entity.cpc,
                        cpm: entity.cpm,
                        spend: entity.spend,
                        purchase: entity.purchase,
                        purchaseValue: entity.purchaseValue,
                        addToCart: entity.addToCart,
                        initiatedCheckout: entity.initiatedCheckout,
                        landingPageViews: entity.landingPageViews,
                        videoViews: entity.videoViews,
                        video25: entity.video25,
                        video50: entity.video50,
                        video75: entity.video75,
                        video95: entity.video95,
                        video100: entity.video100,
                        engagement: entity.engagement,
                        comments: entity.comments,
                        likes: entity.likes,
                        shares: entity.shares,
                        saves: entity.saves,
                        rawPayload: entity.rawPayload,
                        syncedAt: entity.syncedAt,
                    },
                    create: {
                        workspaceId: entity.workspaceId,
                        adId: entity.adId,
                        facebookObjectId: entity.facebookObjectId,
                        provider: entity.provider,
                        date: entity.date,
                        impressions: entity.impressions,
                        reach: entity.reach,
                        frequency: entity.frequency,
                        clicks: entity.clicks,
                        uniqueClicks: entity.uniqueClicks,
                        inlineLinkClicks: entity.inlineLinkClicks,
                        ctr: entity.ctr,
                        cpc: entity.cpc,
                        cpm: entity.cpm,
                        spend: entity.spend,
                        purchase: entity.purchase,
                        purchaseValue: entity.purchaseValue,
                        addToCart: entity.addToCart,
                        initiatedCheckout: entity.initiatedCheckout,
                        landingPageViews: entity.landingPageViews,
                        videoViews: entity.videoViews,
                        video25: entity.video25,
                        video50: entity.video50,
                        video75: entity.video75,
                        video95: entity.video95,
                        video100: entity.video100,
                        engagement: entity.engagement,
                        comments: entity.comments,
                        likes: entity.likes,
                        shares: entity.shares,
                        saves: entity.saves,
                        rawPayload: entity.rawPayload,
                        syncedAt: entity.syncedAt,
                    },
                });
                return { insight, isNew: !existing };
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
    };
    return AdInsightRepository = _classThis;
})();
exports.AdInsightRepository = AdInsightRepository;
//# sourceMappingURL=ad-insight.repository.js.map