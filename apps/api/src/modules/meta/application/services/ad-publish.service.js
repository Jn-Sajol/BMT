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
exports.AdPublishService = void 0;
const common_1 = require("@nestjs/common");
const ad_mapper_1 = require("../../../../application/ad/common/ad.mapper");
const campaign_publish_exceptions_1 = require("../../../../common/exceptions/campaign-publish.exceptions");
const ad_publish_exceptions_1 = require("../../../../common/exceptions/ad-publish.exceptions");
let AdPublishService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdPublishService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdPublishService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        adRepo;
        campaignRepo;
        adSetRepo;
        creativeRepo;
        metaConnectionRepo;
        adAccountRepo;
        publisher;
        encryptionService;
        clockProvider;
        constructor(adRepo, campaignRepo, adSetRepo, creativeRepo, metaConnectionRepo, adAccountRepo, publisher, encryptionService, clockProvider) {
            this.adRepo = adRepo;
            this.campaignRepo = campaignRepo;
            this.adSetRepo = adSetRepo;
            this.creativeRepo = creativeRepo;
            this.metaConnectionRepo = metaConnectionRepo;
            this.adAccountRepo = adAccountRepo;
            this.publisher = publisher;
            this.encryptionService = encryptionService;
            this.clockProvider = clockProvider;
        }
        async publish(adId, workspaceId, userId) {
            const ad = await this.adRepo.findById(adId);
            if (!ad || ad.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Ad draft not found');
            }
            const campaign = await this.campaignRepo.findById(ad.campaignId);
            if (!campaign || campaign.workspaceId !== workspaceId) {
                throw new campaign_publish_exceptions_1.WorkspaceMismatchException();
            }
            const adSet = await this.adSetRepo.findById(ad.adSetId);
            if (!adSet || adSet.campaignId !== campaign.id) {
                throw new ad_publish_exceptions_1.AdPublishValidationException('Parent Ad Set not found or mismatched');
            }
            const creative = await this.creativeRepo.findById(ad.creativeId);
            if (!creative || creative.campaignId !== campaign.id) {
                throw new ad_publish_exceptions_1.AdPublishValidationException('Ad Creative not found or mismatched');
            }
            if (ad.publishedAt || ad.externalAdId) {
                throw new ad_publish_exceptions_1.AdAlreadyPublishedException(adId);
            }
            if (!campaign.isPublished || !campaign.externalCampaignId) {
                throw new ad_publish_exceptions_1.ParentCampaignNotPublishedException(campaign.id);
            }
            if (!adSet.externalAdSetId) {
                throw new ad_publish_exceptions_1.ParentAdSetNotPublishedException(adSet.id);
            }
            if (!creative.externalCreativeId) {
                throw new ad_publish_exceptions_1.CreativeNotPublishedException(creative.id);
            }
            const connection = await this.metaConnectionRepo.findByWorkspaceId(workspaceId);
            if (!connection || connection.status !== 'ACTIVE') {
                throw new campaign_publish_exceptions_1.MetaConnectionNotFoundException(workspaceId);
            }
            const decryptedAccessToken = this.encryptionService.decrypt(connection.encryptedAccessToken);
            if (!decryptedAccessToken) {
                throw new ad_publish_exceptions_1.AdPublishValidationException('Failed to decrypt workspace Meta access token');
            }
            const adAccount = await this.adAccountRepo.findById(campaign.metaAdAccountId);
            if (!adAccount) {
                throw new ad_publish_exceptions_1.AdPublishValidationException('Associated Meta Ad Account context not found internally');
            }
            const result = await this.publisher.publish(ad, adSet.externalAdSetId, creative.externalCreativeId, decryptedAccessToken, adAccount.externalId);
            const now = this.clockProvider.now();
            const updated = {
                ...ad,
                status: 'PUBLISHED',
                publishedAt: now,
                publishedBy: userId,
                externalAdId: result.externalAdId,
                publishResponse: result.rawResponse,
                updatedAt: now,
                updatedBy: userId,
            };
            const currentLabels = ad.labels ? ad.labels.map((l) => l.name) : [];
            const currentTags = ad.tags ? ad.tags.map((t) => t.name) : [];
            const saved = await this.adRepo.save(updated, currentLabels, currentTags);
            return ad_mapper_1.AdMapper.toResponse(saved);
        }
    };
    return AdPublishService = _classThis;
})();
exports.AdPublishService = AdPublishService;
//# sourceMappingURL=ad-publish.service.js.map