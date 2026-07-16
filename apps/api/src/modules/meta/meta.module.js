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
exports.MetaModule = void 0;
const common_1 = require("@nestjs/common");
const meta_auth_controller_1 = require("./presentation/meta-auth.controller");
const campaign_publish_controller_1 = require("./presentation/campaign-publish.controller");
const adset_publish_controller_1 = require("./presentation/adset-publish.controller");
const adcreative_publish_controller_1 = require("./presentation/adcreative-publish.controller");
const ad_publish_controller_1 = require("./presentation/ad-publish.controller");
const meta_insights_controller_1 = require("./presentation/meta-insights.controller");
const meta_status_controller_1 = require("./presentation/meta-status.controller");
const campaign_lifecycle_controller_1 = require("./presentation/campaign-lifecycle.controller");
const adset_lifecycle_controller_1 = require("./presentation/adset-lifecycle.controller");
const adcreative_lifecycle_controller_1 = require("./presentation/adcreative-lifecycle.controller");
const ad_lifecycle_controller_1 = require("./presentation/ad-lifecycle.controller");
const meta_auth_service_1 = require("./application/services/meta-auth.service");
const meta_asset_sync_service_1 = require("./application/services/meta-asset-sync.service");
const meta_business_service_1 = require("./application/services/meta-business.service");
const meta_page_service_1 = require("./application/services/meta-page.service");
const meta_ad_account_service_1 = require("./application/services/meta-ad-account.service");
const meta_instagram_service_1 = require("./application/services/meta-instagram.service");
const meta_pixel_service_1 = require("./application/services/meta-pixel.service");
const meta_catalog_service_1 = require("./application/services/meta-catalog.service");
const meta_relationship_sync_service_1 = require("./application/services/meta-relationship-sync.service");
const meta_business_relationship_service_1 = require("./application/services/meta-business-relationship.service");
const meta_page_relationship_service_1 = require("./application/services/meta-page-relationship.service");
const meta_ad_account_relationship_service_1 = require("./application/services/meta-ad-account-relationship.service");
const campaign_publish_service_1 = require("./application/services/campaign-publish.service");
const campaign_publisher_1 = require("./application/services/campaign-publisher");
const adset_publish_service_1 = require("./application/services/adset-publish.service");
const adset_publisher_1 = require("./application/services/adset-publisher");
const adcreative_publish_service_1 = require("./application/services/adcreative-publish.service");
const adcreative_publisher_1 = require("./application/services/adcreative-publisher");
const ad_publish_service_1 = require("./application/services/ad-publish.service");
const ad_publisher_1 = require("./application/services/ad-publisher");
const meta_insights_service_1 = require("./application/services/meta-insights.service");
const meta_insights_sync_service_1 = require("./application/services/meta-insights-sync.service");
const meta_graph_insights_client_1 = require("./application/services/meta-graph-insights-client");
const meta_status_sync_service_1 = require("./application/services/meta-status-sync.service");
const meta_graph_status_client_1 = require("./application/services/meta-graph-status-client");
const campaign_lifecycle_service_1 = require("./application/services/campaign-lifecycle.service");
const campaign_lifecycle_publisher_1 = require("./application/services/campaign-lifecycle-publisher");
const adset_lifecycle_service_1 = require("./application/services/adset-lifecycle.service");
const adset_lifecycle_publisher_1 = require("./application/services/adset-lifecycle-publisher");
const adcreative_lifecycle_service_1 = require("./application/services/adcreative-lifecycle.service");
const adcreative_creative_publisher_1 = require("./application/services/adcreative-creative-publisher");
const ad_lifecycle_service_1 = require("./application/services/ad-lifecycle.service");
const ad_lifecycle_publisher_1 = require("./application/services/ad-lifecycle-publisher");
const meta_outbox_publisher_1 = require("./application/services/meta-outbox-publisher");
const meta_oauth_provider_1 = require("./infrastructure/oauth/meta-oauth-provider");
const meta_graph_client_1 = require("./infrastructure/oauth/meta-graph-client");
const database_module_1 = require("../../infrastructure/database/database.module");
const security_module_1 = require("../../infrastructure/security/security.module");
const auth_module_1 = require("../../application/auth/auth.module");
let MetaModule = (() => {
    let _classDecorators = [(0, common_1.Module)({
            imports: [database_module_1.DatabaseModule, security_module_1.SecurityModule, auth_module_1.AuthModule],
            controllers: [
                meta_auth_controller_1.MetaAuthController,
                campaign_publish_controller_1.CampaignPublishController,
                adset_publish_controller_1.AdSetPublishController,
                adcreative_publish_controller_1.AdCreativePublishController,
                ad_publish_controller_1.AdPublishController,
                meta_insights_controller_1.MetaInsightsController,
                meta_status_controller_1.MetaStatusController,
                campaign_lifecycle_controller_1.CampaignLifecycleController,
                adset_lifecycle_controller_1.AdSetLifecycleController,
                adcreative_lifecycle_controller_1.AdCreativeLifecycleController,
                ad_lifecycle_controller_1.AdLifecycleController,
            ],
            providers: [
                meta_auth_service_1.MetaAuthService,
                meta_asset_sync_service_1.MetaAssetSyncService,
                meta_business_service_1.MetaBusinessService,
                meta_page_service_1.MetaPageService,
                meta_ad_account_service_1.MetaAdAccountService,
                meta_instagram_service_1.MetaInstagramService,
                meta_pixel_service_1.MetaPixelService,
                meta_catalog_service_1.MetaCatalogService,
                meta_relationship_sync_service_1.MetaRelationshipSyncService,
                meta_business_relationship_service_1.MetaBusinessRelationshipService,
                meta_page_relationship_service_1.MetaPageRelationshipService,
                meta_ad_account_relationship_service_1.MetaAdAccountRelationshipService,
                campaign_publish_service_1.CampaignPublishService,
                campaign_publisher_1.CampaignPublisher,
                adset_publish_service_1.AdSetPublishService,
                adset_publisher_1.AdSetPublisher,
                adcreative_publish_service_1.AdCreativePublishService,
                adcreative_publisher_1.AdCreativePublisher,
                ad_publish_service_1.AdPublishService,
                ad_publisher_1.MetaAdPublisher,
                meta_insights_service_1.MetaInsightsService,
                meta_insights_sync_service_1.MetaInsightsSyncService,
                meta_graph_insights_client_1.MetaGraphInsightsClient,
                meta_status_sync_service_1.MetaStatusSyncService,
                meta_graph_status_client_1.MetaGraphStatusClient,
                campaign_lifecycle_service_1.CampaignLifecycleService,
                campaign_lifecycle_publisher_1.CampaignLifecyclePublisher,
                adset_lifecycle_service_1.AdSetLifecycleService,
                adset_lifecycle_publisher_1.AdSetLifecyclePublisher,
                adcreative_lifecycle_service_1.AdCreativeLifecycleService,
                adcreative_creative_publisher_1.AdCreativeLifecyclePublisher,
                ad_lifecycle_service_1.AdLifecycleService,
                ad_lifecycle_publisher_1.AdLifecyclePublisher,
                meta_outbox_publisher_1.MetaOutboxPublisher,
                meta_graph_client_1.MetaGraphClient,
                {
                    provide: 'META_OAUTH_PROVIDER',
                    useClass: meta_oauth_provider_1.MetaOAuthProvider,
                },
            ],
            exports: [
                meta_auth_service_1.MetaAuthService,
                meta_asset_sync_service_1.MetaAssetSyncService,
                meta_relationship_sync_service_1.MetaRelationshipSyncService,
                campaign_publish_service_1.CampaignPublishService,
                adset_publish_service_1.AdSetPublishService,
                adcreative_publish_service_1.AdCreativePublishService,
                ad_publish_service_1.AdPublishService,
                meta_business_service_1.MetaBusinessService,
                meta_page_service_1.MetaPageService,
                meta_ad_account_service_1.MetaAdAccountService,
                meta_instagram_service_1.MetaInstagramService,
                meta_pixel_service_1.MetaPixelService,
                meta_catalog_service_1.MetaCatalogService,
                meta_business_relationship_service_1.MetaBusinessRelationshipService,
                meta_page_relationship_service_1.MetaPageRelationshipService,
                meta_ad_account_relationship_service_1.MetaAdAccountRelationshipService,
                meta_insights_service_1.MetaInsightsService,
                meta_insights_sync_service_1.MetaInsightsSyncService,
                meta_status_sync_service_1.MetaStatusSyncService,
                campaign_lifecycle_service_1.CampaignLifecycleService,
                adset_lifecycle_service_1.AdSetLifecycleService,
                adcreative_lifecycle_service_1.AdCreativeLifecycleService,
                ad_lifecycle_service_1.AdLifecycleService,
                meta_outbox_publisher_1.MetaOutboxPublisher,
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MetaModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MetaModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return MetaModule = _classThis;
})();
exports.MetaModule = MetaModule;
//# sourceMappingURL=meta.module.js.map