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
exports.AdSetPublishService = void 0;
const common_1 = require("@nestjs/common");
const adset_mapper_1 = require("../../../../application/adset/common/adset.mapper");
const campaign_publish_exceptions_1 = require("../../../../common/exceptions/campaign-publish.exceptions");
const adset_publish_exceptions_1 = require("../../../../common/exceptions/adset-publish.exceptions");
let AdSetPublishService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdSetPublishService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdSetPublishService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        adSetRepo;
        campaignRepo;
        metaConnectionRepo;
        adAccountRepo;
        publisher;
        encryptionService;
        clockProvider;
        constructor(adSetRepo, campaignRepo, metaConnectionRepo, adAccountRepo, publisher, encryptionService, clockProvider) {
            this.adSetRepo = adSetRepo;
            this.campaignRepo = campaignRepo;
            this.metaConnectionRepo = metaConnectionRepo;
            this.adAccountRepo = adAccountRepo;
            this.publisher = publisher;
            this.encryptionService = encryptionService;
            this.clockProvider = clockProvider;
        }
        async publish(adSetId, workspaceId, userId) {
            const adSet = await this.adSetRepo.findById(adSetId);
            if (!adSet) {
                throw new common_1.NotFoundException('Ad Set draft not found');
            }
            const campaign = await this.campaignRepo.findById(adSet.campaignId);
            if (!campaign || campaign.workspaceId !== workspaceId) {
                throw new campaign_publish_exceptions_1.WorkspaceMismatchException();
            }
            if (adSet.publishedAt || adSet.externalAdSetId) {
                throw new adset_publish_exceptions_1.AdSetAlreadyPublishedException(adSetId);
            }
            if (!campaign.isPublished || !campaign.externalCampaignId) {
                throw new adset_publish_exceptions_1.CampaignNotPublishedException(campaign.id);
            }
            const connection = await this.metaConnectionRepo.findByWorkspaceId(workspaceId);
            if (!connection || connection.status !== 'ACTIVE') {
                throw new campaign_publish_exceptions_1.MetaConnectionNotFoundException(workspaceId);
            }
            const decryptedAccessToken = this.encryptionService.decrypt(connection.encryptedAccessToken);
            if (!decryptedAccessToken) {
                throw new adset_publish_exceptions_1.AdSetValidationException('Failed to decrypt workspace Meta access token');
            }
            const adAccount = await this.adAccountRepo.findById(campaign.metaAdAccountId);
            if (!adAccount) {
                throw new adset_publish_exceptions_1.AdSetValidationException('Associated Meta Ad Account context not found internally');
            }
            const result = await this.publisher.publish(adSet, campaign.externalCampaignId, decryptedAccessToken, adAccount.externalId);
            const now = this.clockProvider.now();
            const updated = {
                ...adSet,
                status: 'PUBLISHED',
                publishedAt: now,
                publishedBy: userId,
                externalAdSetId: result.externalAdSetId,
                publishResponse: result.rawResponse,
                updatedAt: now,
                updatedBy: userId,
            };
            const currentLabels = adSet.labels ? adSet.labels.map((l) => l.name) : [];
            const currentTags = adSet.tags ? adSet.tags.map((t) => t.name) : [];
            const saved = await this.adSetRepo.save(updated, currentLabels, currentTags);
            return adset_mapper_1.AdSetMapper.toResponse(saved);
        }
    };
    return AdSetPublishService = _classThis;
})();
exports.AdSetPublishService = AdSetPublishService;
//# sourceMappingURL=adset-publish.service.js.map