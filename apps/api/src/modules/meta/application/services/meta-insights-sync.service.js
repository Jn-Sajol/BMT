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
exports.MetaInsightsSyncService = void 0;
const common_1 = require("@nestjs/common");
const meta_insights_mapper_1 = require("./meta-insights.mapper");
let MetaInsightsSyncService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MetaInsightsSyncService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MetaInsightsSyncService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        connectionRepo;
        campaignRepo;
        adSetRepo;
        adRepo;
        campaignInsightRepo;
        adSetInsightRepo;
        adInsightRepo;
        historyRepo;
        insightsClient;
        clockProvider;
        encryptionService;
        fields = [
            'impressions',
            'reach',
            'frequency',
            'clicks',
            'ctr',
            'cpc',
            'cpm',
            'spend',
            'actions',
            'action_values',
            'video_play_actions',
            'video_p25_watched_actions',
            'video_p50_watched_actions',
            'video_p75_watched_actions',
            'video_p95_watched_actions',
            'video_p100_watched_actions',
            'date_start',
            'date_stop',
        ];
        constructor(connectionRepo, campaignRepo, adSetRepo, adRepo, campaignInsightRepo, adSetInsightRepo, adInsightRepo, historyRepo, insightsClient, clockProvider, encryptionService) {
            this.connectionRepo = connectionRepo;
            this.campaignRepo = campaignRepo;
            this.adSetRepo = adSetRepo;
            this.adRepo = adRepo;
            this.campaignInsightRepo = campaignInsightRepo;
            this.adSetInsightRepo = adSetInsightRepo;
            this.adInsightRepo = adInsightRepo;
            this.historyRepo = historyRepo;
            this.insightsClient = insightsClient;
            this.clockProvider = clockProvider;
            this.encryptionService = encryptionService;
        }
        async sync(dto, workspaceId) {
            const startedAt = this.clockProvider.now();
            const history = {
                id: '',
                workspaceId,
                status: 'RUNNING',
                startedAt,
                finishedAt: null,
                recordsProcessed: 0,
                recordsCreated: 0,
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
                const params = {
                    time_increment: 1,
                    limit: 100,
                };
                if (dto.since && dto.until) {
                    params.time_range = { since: dto.since, until: dto.until };
                }
                else {
                    params.date_preset = dto.datePreset || 'yesterday';
                }
                let processed = 0;
                let created = 0;
                let updated = 0;
                const campaigns = await this.campaignRepo.findByWorkspaceId(workspaceId);
                const publishedCampaigns = campaigns.filter((c) => c.externalCampaignId);
                for (const campaign of publishedCampaigns) {
                    // Sync Campaign Insights
                    let afterCursor = undefined;
                    let hasMore = true;
                    while (hasMore) {
                        const res = await this.insightsClient.fetchInsights(campaign.externalCampaignId, accessToken, this.fields, { ...params, after: afterCursor });
                        for (const item of res.data) {
                            const normalized = this.normalizeItem(item, workspaceId);
                            const { isNew } = await this.campaignInsightRepo.upsert({
                                ...normalized,
                                campaignId: campaign.id,
                            });
                            processed++;
                            if (isNew)
                                created++;
                            else
                                updated++;
                        }
                        afterCursor = res.paging?.cursors?.after;
                        hasMore = !!afterCursor;
                    }
                    // Fetch AdSets for this Campaign
                    const adsets = await this.adSetRepo.findByCampaignId(campaign.id);
                    const publishedAdsets = adsets.filter((a) => a.externalAdSetId);
                    for (const adset of publishedAdsets) {
                        // Sync AdSet Insights
                        let adsetAfterCursor = undefined;
                        let adsetHasMore = true;
                        while (adsetHasMore) {
                            const res = await this.insightsClient.fetchInsights(adset.externalAdSetId, accessToken, this.fields, { ...params, after: adsetAfterCursor });
                            for (const item of res.data) {
                                const normalized = this.normalizeItem(item, workspaceId);
                                const { isNew } = await this.adSetInsightRepo.upsert({
                                    ...normalized,
                                    adSetId: adset.id,
                                });
                                processed++;
                                if (isNew)
                                    created++;
                                else
                                    updated++;
                            }
                            adsetAfterCursor = res.paging?.cursors?.after;
                            adsetHasMore = !!adsetAfterCursor;
                        }
                        // Fetch Ads for this AdSet
                        const ads = await this.adRepo.findByAdSetId(adset.id);
                        const publishedAds = ads.filter((a) => a.externalAdId);
                        for (const ad of publishedAds) {
                            // Sync Ad Insights
                            let adAfterCursor = undefined;
                            let adHasMore = true;
                            while (adHasMore) {
                                const res = await this.insightsClient.fetchInsights(ad.externalAdId, accessToken, this.fields, { ...params, after: adAfterCursor });
                                for (const item of res.data) {
                                    const normalized = this.normalizeItem(item, workspaceId);
                                    const { isNew } = await this.adInsightRepo.upsert({
                                        ...normalized,
                                        adId: ad.id,
                                    });
                                    processed++;
                                    if (isNew)
                                        created++;
                                    else
                                        updated++;
                                }
                                adAfterCursor = res.paging?.cursors?.after;
                                adHasMore = !!adAfterCursor;
                            }
                        }
                    }
                }
                const finishedAt = this.clockProvider.now();
                savedHistory.status = 'SUCCESS';
                savedHistory.finishedAt = finishedAt;
                savedHistory.recordsProcessed = processed;
                savedHistory.recordsCreated = created;
                savedHistory.recordsUpdated = updated;
                savedHistory.duration = Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000);
                const finalHistory = await this.historyRepo.save(savedHistory);
                return meta_insights_mapper_1.MetaInsightsMapper.toSyncHistoryResponse(finalHistory);
            }
            catch (err) {
                const finishedAt = this.clockProvider.now();
                savedHistory.status = 'FAILED';
                savedHistory.finishedAt = finishedAt;
                savedHistory.errorMessage = err.message || 'Unknown Sync Error';
                savedHistory.duration = Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000);
                const finalHistory = await this.historyRepo.save(savedHistory);
                return meta_insights_mapper_1.MetaInsightsMapper.toSyncHistoryResponse(finalHistory);
            }
        }
        normalizeItem(item, workspaceId) {
            const parseAction = (arr, type) => {
                const match = arr?.find((a) => a.action_type === type);
                return match ? Math.round(Number(match.value)) : 0;
            };
            const parseActionFloat = (arr, type) => {
                const match = arr?.find((a) => a.action_type === type);
                return match ? Number(match.value) : 0.0;
            };
            const actions = item.actions || [];
            const actionValues = item.action_values || [];
            const purchase = parseAction(actions, 'purchase') || parseAction(actions, 'offsite_conversion.fb_pixel_purchase');
            const purchaseValue = parseActionFloat(actionValues, 'purchase') || parseActionFloat(actionValues, 'offsite_conversion.fb_pixel_purchase');
            const addToCart = parseAction(actions, 'add_to_cart') || parseAction(actions, 'offsite_conversion.fb_pixel_add_to_cart');
            const initiatedCheckout = parseAction(actions, 'initiate_checkout') || parseAction(actions, 'offsite_conversion.fb_pixel_initiate_checkout');
            const landingPageViews = parseAction(actions, 'landing_page_view');
            const videoViews = parseAction(item.video_play_actions || [], 'video_play');
            const video25 = parseAction(item.video_p25_watched_actions || [], 'video_p25_watched');
            const video50 = parseAction(item.video_p50_watched_actions || [], 'video_p50_watched');
            const video75 = parseAction(item.video_p75_watched_actions || [], 'video_p75_watched');
            const video95 = parseAction(item.video_p95_watched_actions || [], 'video_p95_watched');
            const video100 = parseAction(item.video_p100_watched_actions || [], 'video_p100_watched');
            const comments = parseAction(actions, 'comment');
            const likes = parseAction(actions, 'like') || parseAction(actions, 'post_reaction');
            const shares = parseAction(actions, 'share');
            const saves = parseAction(actions, 'save');
            return {
                workspaceId,
                facebookObjectId: item.campaign_id || item.adset_id || item.ad_id,
                provider: 'meta',
                date: new Date(item.date_start),
                impressions: Number(item.impressions) || 0,
                reach: Number(item.reach) || 0,
                frequency: Number(item.frequency) || 0.0,
                clicks: Number(item.clicks) || 0,
                uniqueClicks: Number(item.unique_clicks) || 0,
                inlineLinkClicks: Number(item.inline_link_clicks) || 0,
                ctr: Number(item.ctr) || 0.0,
                cpc: Number(item.cpc) || 0.0,
                cpm: Number(item.cpm) || 0.0,
                spend: Number(item.spend) || 0.0,
                purchase,
                purchaseValue,
                addToCart,
                initiatedCheckout,
                landingPageViews,
                videoViews,
                video25,
                video50,
                video75,
                video95,
                video100,
                engagement: comments + likes + shares + saves,
                comments,
                likes,
                shares,
                saves,
                rawPayload: item,
                syncedAt: this.clockProvider.now(),
            };
        }
    };
    return MetaInsightsSyncService = _classThis;
})();
exports.MetaInsightsSyncService = MetaInsightsSyncService;
//# sourceMappingURL=meta-insights-sync.service.js.map