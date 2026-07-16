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
exports.AdLifecycleService = void 0;
const common_1 = require("@nestjs/common");
const ad_lifecycle_mapper_1 = require("./ad-lifecycle.mapper");
const ad_lifecycle_exceptions_1 = require("../../../../common/exceptions/ad-lifecycle.exceptions");
const client_1 = require("@prisma/client");
let AdLifecycleService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdLifecycleService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdLifecycleService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        lifecycleRepo;
        connectionRepo;
        creativeRepo;
        campaignRepo;
        publisher;
        clockProvider;
        encryptionService;
        constructor(lifecycleRepo, connectionRepo, creativeRepo, campaignRepo, publisher, clockProvider, encryptionService) {
            this.lifecycleRepo = lifecycleRepo;
            this.connectionRepo = connectionRepo;
            this.creativeRepo = creativeRepo;
            this.campaignRepo = campaignRepo;
            this.publisher = publisher;
            this.clockProvider = clockProvider;
            this.encryptionService = encryptionService;
        }
        async updateAd(adId, workspaceId, userId, dto) {
            const ad = await this.loadAndValidateAd(adId, workspaceId);
            let externalCreativeId;
            if (dto.creativeId) {
                const creative = await this.creativeRepo.findById(dto.creativeId);
                if (!creative) {
                    throw new common_1.NotFoundException('Target Ad Creative not found.');
                }
                const campaign = await this.campaignRepo.findById(creative.campaignId);
                if (!campaign || campaign.workspaceId !== workspaceId) {
                    throw new common_1.NotFoundException('Target Ad Creative not found.');
                }
                if (!creative.externalCreativeId) {
                    throw new Error('Target Ad Creative is not published to Meta.');
                }
                externalCreativeId = creative.externalCreativeId;
            }
            const accessToken = await this.getAccessToken(workspaceId);
            try {
                const response = await this.publisher.updateAd(ad.externalAdId, {
                    name: dto.name,
                    creativeId: externalCreativeId,
                    trackingSpecs: dto.trackingSpecs,
                }, accessToken);
                await this.lifecycleRepo.updateAdAttributes(adId, {
                    name: dto.name,
                    creativeId: dto.creativeId,
                    trackingSpecs: dto.trackingSpecs,
                    updatedBy: userId,
                });
                const history = await this.lifecycleRepo.insertHistory(adId, 'UPDATE', ad.status, ad.status, userId, this.clockProvider.now(), response);
                return ad_lifecycle_mapper_1.AdLifecycleMapper.toHistoryDto(history);
            }
            catch (err) {
                throw new ad_lifecycle_exceptions_1.MetaOperationFailedException(err.message);
            }
        }
        async pauseAd(adId, workspaceId, userId) {
            const ad = await this.loadAndValidateAd(adId, workspaceId);
            const currentEffective = ad.statusDetail?.effectiveStatus || 'ACTIVE';
            if (ad.status === client_1.CampaignStatus.ARCHIVED) {
                throw new ad_lifecycle_exceptions_1.AdArchivedException(adId);
            }
            if (currentEffective === 'PAUSED' || currentEffective === 'AD_PAUSED') {
                throw new ad_lifecycle_exceptions_1.AdAlreadyPausedException(adId);
            }
            const accessToken = await this.getAccessToken(workspaceId);
            try {
                const response = await this.publisher.pauseAd(ad.externalAdId, accessToken);
                await this.lifecycleRepo.updateAdStatus(adId, client_1.CampaignStatus.PUBLISHED, 'PAUSED', this.clockProvider.now(), response, userId);
                const history = await this.lifecycleRepo.insertHistory(adId, 'PAUSE', currentEffective, 'PAUSED', userId, this.clockProvider.now(), response);
                return ad_lifecycle_mapper_1.AdLifecycleMapper.toHistoryDto(history);
            }
            catch (err) {
                throw new ad_lifecycle_exceptions_1.MetaOperationFailedException(err.message);
            }
        }
        async resumeAd(adId, workspaceId, userId) {
            const ad = await this.loadAndValidateAd(adId, workspaceId);
            const currentEffective = ad.statusDetail?.effectiveStatus || 'PAUSED';
            if (ad.status === client_1.CampaignStatus.ARCHIVED) {
                throw new ad_lifecycle_exceptions_1.AdArchivedException(adId);
            }
            if (currentEffective === 'ACTIVE') {
                throw new ad_lifecycle_exceptions_1.AdAlreadyActiveException(adId);
            }
            const accessToken = await this.getAccessToken(workspaceId);
            try {
                const response = await this.publisher.resumeAd(ad.externalAdId, accessToken);
                await this.lifecycleRepo.updateAdStatus(adId, client_1.CampaignStatus.PUBLISHED, 'ACTIVE', this.clockProvider.now(), response, userId);
                const history = await this.lifecycleRepo.insertHistory(adId, 'RESUME', currentEffective, 'ACTIVE', userId, this.clockProvider.now(), response);
                return ad_lifecycle_mapper_1.AdLifecycleMapper.toHistoryDto(history);
            }
            catch (err) {
                throw new ad_lifecycle_exceptions_1.MetaOperationFailedException(err.message);
            }
        }
        async archiveAd(adId, workspaceId, userId) {
            const ad = await this.loadAndValidateAd(adId, workspaceId);
            const currentEffective = ad.statusDetail?.effectiveStatus || 'ACTIVE';
            if (ad.status === client_1.CampaignStatus.ARCHIVED) {
                throw new ad_lifecycle_exceptions_1.AdArchivedException(adId);
            }
            const accessToken = await this.getAccessToken(workspaceId);
            try {
                const response = await this.publisher.archiveAd(ad.externalAdId, accessToken);
                await this.lifecycleRepo.updateAdStatus(adId, client_1.CampaignStatus.ARCHIVED, 'ARCHIVED', this.clockProvider.now(), response, userId);
                const history = await this.lifecycleRepo.insertHistory(adId, 'ARCHIVE', currentEffective, 'ARCHIVED', userId, this.clockProvider.now(), response);
                return ad_lifecycle_mapper_1.AdLifecycleMapper.toHistoryDto(history);
            }
            catch (err) {
                throw new ad_lifecycle_exceptions_1.MetaOperationFailedException(err.message);
            }
        }
        async loadAndValidateAd(adId, workspaceId) {
            const ad = await this.lifecycleRepo.findById(adId);
            if (!ad || ad.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Ad not found.');
            }
            if (!ad.externalAdId) {
                throw new ad_lifecycle_exceptions_1.AdNotPublishedException(adId);
            }
            if (ad.status === client_1.CampaignStatus.ARCHIVED) {
                throw new ad_lifecycle_exceptions_1.AdArchivedException(adId);
            }
            return ad;
        }
        async getAccessToken(workspaceId) {
            const connection = await this.connectionRepo.findByWorkspaceId(workspaceId);
            if (!connection || connection.status !== 'ACTIVE') {
                throw new common_1.NotFoundException('Active Meta Connection not found for workspace.');
            }
            const decrypted = this.encryptionService.decrypt(connection.encryptedAccessToken);
            if (!decrypted) {
                throw new Error('Failed to decrypt Meta connection token.');
            }
            return decrypted;
        }
    };
    return AdLifecycleService = _classThis;
})();
exports.AdLifecycleService = AdLifecycleService;
//# sourceMappingURL=ad-lifecycle.service.js.map