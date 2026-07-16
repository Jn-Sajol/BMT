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
exports.CampaignPublishService = void 0;
const common_1 = require("@nestjs/common");
const campaign_mapper_1 = require("../../../../common/mappers/campaign.mapper");
const campaign_publish_exceptions_1 = require("../../../../common/exceptions/campaign-publish.exceptions");
let CampaignPublishService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CampaignPublishService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CampaignPublishService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        campaignRepo;
        metaConnectionRepo;
        adAccountRepo;
        publisher;
        encryptionService;
        clockProvider;
        constructor(campaignRepo, metaConnectionRepo, adAccountRepo, publisher, encryptionService, clockProvider) {
            this.campaignRepo = campaignRepo;
            this.metaConnectionRepo = metaConnectionRepo;
            this.adAccountRepo = adAccountRepo;
            this.publisher = publisher;
            this.encryptionService = encryptionService;
            this.clockProvider = clockProvider;
        }
        async publish(campaignId, workspaceId, userId) {
            const campaign = await this.campaignRepo.findById(campaignId);
            if (!campaign) {
                throw new common_1.NotFoundException('Campaign draft not found');
            }
            if (campaign.workspaceId !== workspaceId) {
                throw new campaign_publish_exceptions_1.WorkspaceMismatchException();
            }
            if (campaign.isPublished || campaign.status === 'PUBLISHED') {
                throw new campaign_publish_exceptions_1.CampaignAlreadyPublishedException(campaignId);
            }
            const connection = await this.metaConnectionRepo.findByWorkspaceId(workspaceId);
            if (!connection || connection.status !== 'ACTIVE') {
                throw new campaign_publish_exceptions_1.MetaConnectionNotFoundException(workspaceId);
            }
            const adAccount = await this.adAccountRepo.findById(campaign.metaAdAccountId);
            if (!adAccount) {
                throw new campaign_publish_exceptions_1.CampaignValidationException('Associated Meta Ad Account context not found internally');
            }
            const decryptedAccessToken = this.encryptionService.decrypt(connection.encryptedAccessToken);
            if (!decryptedAccessToken) {
                throw new campaign_publish_exceptions_1.CampaignValidationException('Failed to decrypt workspace Meta access token');
            }
            const result = await this.publisher.publish(campaign, decryptedAccessToken, adAccount.externalId);
            const now = this.clockProvider.now();
            const updated = {
                ...campaign,
                status: 'PUBLISHED',
                isPublished: true,
                publishedAt: now,
                publishedBy: userId,
                externalCampaignId: result.externalCampaignId,
                publishResponse: result.rawResponse,
                updatedAt: now,
                updatedBy: userId,
            };
            const currentLabels = campaign.labels ? campaign.labels.map((l) => l.name) : [];
            const currentTags = campaign.tags ? campaign.tags.map((t) => t.name) : [];
            const saved = await this.campaignRepo.save(updated, currentLabels, currentTags);
            return campaign_mapper_1.CampaignMapper.toResponse(saved);
        }
    };
    return CampaignPublishService = _classThis;
})();
exports.CampaignPublishService = CampaignPublishService;
//# sourceMappingURL=campaign-publish.service.js.map