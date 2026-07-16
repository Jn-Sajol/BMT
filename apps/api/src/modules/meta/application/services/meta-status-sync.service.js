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
exports.MetaStatusSyncService = void 0;
const common_1 = require("@nestjs/common");
const meta_status_mapper_1 = require("./meta-status.mapper");
let MetaStatusSyncService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MetaStatusSyncService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MetaStatusSyncService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        connectionRepo;
        campaignRepo;
        adSetRepo;
        adRepo;
        statusRepo;
        historyRepo;
        graphStatusClient;
        clockProvider;
        encryptionService;
        constructor(connectionRepo, campaignRepo, adSetRepo, adRepo, statusRepo, historyRepo, graphStatusClient, clockProvider, encryptionService) {
            this.connectionRepo = connectionRepo;
            this.campaignRepo = campaignRepo;
            this.adSetRepo = adSetRepo;
            this.adRepo = adRepo;
            this.statusRepo = statusRepo;
            this.historyRepo = historyRepo;
            this.graphStatusClient = graphStatusClient;
            this.clockProvider = clockProvider;
            this.encryptionService = encryptionService;
        }
        async getHistory(workspaceId) {
            const list = await this.historyRepo.findHistoryByWorkspaceId(workspaceId);
            return list.map(meta_status_mapper_1.MetaStatusMapper.toHistoryDto);
        }
        async sync(workspaceId) {
            const startedAt = this.clockProvider.now();
            const history = {
                id: '',
                workspaceId,
                status: 'RUNNING',
                startedAt,
                finishedAt: null,
                recordsProcessed: 0,
                recordsUpdated: 0,
                duration: null,
                errorMessage: null,
            };
            const savedHistory = await this.historyRepo.save(history);
            try {
                const connection = await this.connectionRepo.findByWorkspaceId(workspaceId);
                if (!connection || connection.status !== 'ACTIVE') {
                    throw new common_1.NotFoundException('Active Meta Connection not found for workspace.');
                }
                const accessToken = this.encryptionService.decrypt(connection.encryptedAccessToken);
                if (!accessToken) {
                    throw new Error('Failed to decrypt Meta Connection Access Token.');
                }
                let processed = 0;
                let updated = 0;
                const campaigns = await this.campaignRepo.findByWorkspaceId(workspaceId);
                const publishedCampaigns = campaigns.filter((c) => c.externalCampaignId);
                for (const campaign of publishedCampaigns) {
                    processed++;
                    const remoteCampaign = await this.graphStatusClient.fetchCampaignStatus(campaign.externalCampaignId, accessToken);
                    const statusDetail = await this.statusRepo.findCampaignStatusDetail(campaign.id);
                    const existingPayload = statusDetail?.statusRawPayload;
                    const hasChanged = !existingPayload ||
                        existingPayload.updated_time !== remoteCampaign.updated_time ||
                        existingPayload.status !== remoteCampaign.status;
                    if (hasChanged) {
                        const effectiveStatus = remoteCampaign.effective_status || 'UNKNOWN';
                        const reviewStatus = remoteCampaign.review_feedback ? 'REJECTED' : 'APPROVED';
                        const deliveryStatus = remoteCampaign.delivery_info?.status || 'UNKNOWN';
                        await this.statusRepo.updateCampaignStatus(campaign.id, effectiveStatus, reviewStatus, deliveryStatus, remoteCampaign, this.clockProvider.now());
                        updated++;
                    }
                    const adsets = await this.adSetRepo.findByCampaignId(campaign.id);
                    const publishedAdsets = adsets.filter((a) => a.externalAdSetId);
                    for (const adset of publishedAdsets) {
                        processed++;
                        const remoteAdset = await this.graphStatusClient.fetchAdSetStatus(adset.externalAdSetId, accessToken);
                        const adsetDetail = await this.statusRepo.findAdSetStatusDetail(adset.id);
                        const existingAdSetPayload = adsetDetail?.statusRawPayload;
                        const adSetChanged = !existingAdSetPayload ||
                            existingAdSetPayload.updated_time !== remoteAdset.updated_time ||
                            existingAdSetPayload.status !== remoteAdset.status;
                        if (adSetChanged) {
                            const effectiveStatus = remoteAdset.effective_status || 'UNKNOWN';
                            const reviewStatus = remoteAdset.review_feedback ? 'REJECTED' : 'APPROVED';
                            const deliveryStatus = remoteAdset.delivery_info?.status || 'UNKNOWN';
                            await this.statusRepo.updateAdSetStatus(adset.id, effectiveStatus, reviewStatus, deliveryStatus, remoteAdset, this.clockProvider.now());
                            updated++;
                        }
                        const ads = await this.adRepo.findByAdSetId(adset.id);
                        const publishedAds = ads.filter((a) => a.externalAdId);
                        for (const ad of publishedAds) {
                            processed++;
                            const remoteAd = await this.graphStatusClient.fetchAdStatus(ad.externalAdId, accessToken);
                            const adDetail = await this.statusRepo.findAdStatusDetail(ad.id);
                            const existingAdPayload = adDetail?.statusRawPayload;
                            const adChanged = !existingAdPayload ||
                                existingAdPayload.updated_time !== remoteAd.updated_time ||
                                existingAdPayload.status !== remoteAd.status;
                            if (adChanged) {
                                const effectiveStatus = remoteAd.effective_status || 'UNKNOWN';
                                const reviewStatus = remoteAd.review_feedback ? 'REJECTED' : 'APPROVED';
                                const deliveryStatus = remoteAd.delivery_info?.status || 'UNKNOWN';
                                await this.statusRepo.updateAdStatus(ad.id, effectiveStatus, reviewStatus, deliveryStatus, remoteAd, this.clockProvider.now());
                                updated++;
                            }
                        }
                    }
                }
                const finishedAt = this.clockProvider.now();
                savedHistory.status = 'SUCCESS';
                savedHistory.finishedAt = finishedAt;
                savedHistory.recordsProcessed = processed;
                savedHistory.recordsUpdated = updated;
                savedHistory.duration = Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000);
                const finalHistory = await this.historyRepo.save(savedHistory);
                return meta_status_mapper_1.MetaStatusMapper.toHistoryDto(finalHistory);
            }
            catch (err) {
                const finishedAt = this.clockProvider.now();
                savedHistory.status = 'FAILED';
                savedHistory.finishedAt = finishedAt;
                savedHistory.errorMessage = err.message || 'Unknown Status Sync Error';
                savedHistory.duration = Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000);
                const finalHistory = await this.historyRepo.save(savedHistory);
                return meta_status_mapper_1.MetaStatusMapper.toHistoryDto(finalHistory);
            }
        }
    };
    return MetaStatusSyncService = _classThis;
})();
exports.MetaStatusSyncService = MetaStatusSyncService;
//# sourceMappingURL=meta-status-sync.service.js.map