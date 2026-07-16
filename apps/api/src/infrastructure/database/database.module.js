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
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_client_service_1 = require("./prisma-client.service");
const prisma_extensions_1 = require("./prisma-extensions");
const user_repository_1 = require("./repositories/user.repository");
const user_session_repository_1 = require("./repositories/user-session.repository");
const user_invitation_repository_1 = require("./repositories/user-invitation.repository");
const organization_repository_1 = require("./repositories/organization.repository");
const workspace_repository_1 = require("./repositories/workspace.repository");
const organization_member_repository_1 = require("./repositories/organization-member.repository");
const verification_repository_1 = require("./repositories/verification.repository");
const password_reset_repository_1 = require("./repositories/password-reset.repository");
const permission_repository_1 = require("./repositories/permission.repository");
const role_repository_1 = require("./repositories/role.repository");
const meta_connection_repository_1 = require("./repositories/meta-connection.repository");
const meta_business_repository_1 = require("./repositories/meta-business.repository");
const meta_page_repository_1 = require("./repositories/meta-page.repository");
const meta_ad_account_repository_1 = require("./repositories/meta-ad-account.repository");
const meta_instagram_repository_1 = require("./repositories/meta-instagram.repository");
const meta_pixel_repository_1 = require("./repositories/meta-pixel.repository");
const meta_catalog_repository_1 = require("./repositories/meta-catalog.repository");
const meta_sync_history_repository_1 = require("./repositories/meta-sync-history.repository");
const meta_business_page_repository_1 = require("./repositories/meta-business-page.repository");
const meta_business_ad_account_repository_1 = require("./repositories/meta-business-ad-account.repository");
const meta_business_pixel_repository_1 = require("./repositories/meta-business-pixel.repository");
const meta_business_catalog_repository_1 = require("./repositories/meta-business-catalog.repository");
const meta_page_instagram_repository_1 = require("./repositories/meta-page-instagram.repository");
const meta_ad_account_pixel_repository_1 = require("./repositories/meta-ad-account-pixel.repository");
const campaign_repository_1 = require("./repositories/campaign.repository");
const ad_set_repository_1 = require("./repositories/ad-set.repository");
const ad_creative_repository_1 = require("./repositories/ad-creative.repository");
const ad_repository_1 = require("./repositories/ad.repository");
const media_repository_1 = require("./repositories/media.repository");
const campaign_insight_repository_1 = require("./repositories/campaign-insight.repository");
const adset_insight_repository_1 = require("./repositories/adset-insight.repository");
const ad_insight_repository_1 = require("./repositories/ad-insight.repository");
const meta_insight_repository_1 = require("./repositories/meta-insight.repository");
const insight_sync_history_repository_1 = require("./repositories/insight-sync-history.repository");
const status_sync_history_repository_1 = require("./repositories/status-sync-history.repository");
const meta_status_repository_1 = require("./repositories/meta-status.repository");
const campaign_lifecycle_repository_1 = require("./repositories/campaign-lifecycle.repository");
const adset_lifecycle_repository_1 = require("./repositories/adset-lifecycle.repository");
const adcreative_lifecycle_repository_1 = require("./repositories/adcreative-lifecycle.repository");
const ad_lifecycle_repository_1 = require("./repositories/ad-lifecycle.repository");
const webhook_inbox_repository_1 = require("./repositories/webhook-inbox.repository");
const job_repository_1 = require("./repositories/job.repository");
const meta_outbox_repository_1 = require("./repositories/meta-outbox.repository");
const automation_rule_repository_1 = require("./repositories/automation-rule.repository");
const constants_1 = require("./constants");
let DatabaseModule = (() => {
    let _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({
            providers: [
                prisma_client_service_1.PrismaClientService,
                {
                    provide: constants_1.PRISMA_CLIENT,
                    useFactory: (prismaService) => {
                        return (0, prisma_extensions_1.extendPrismaClient)(prismaService);
                    },
                    inject: [prisma_client_service_1.PrismaClientService],
                },
                user_repository_1.UserRepository,
                user_session_repository_1.UserSessionRepository,
                user_invitation_repository_1.UserInvitationRepository,
                organization_repository_1.OrganizationRepository,
                workspace_repository_1.WorkspaceRepository,
                organization_member_repository_1.OrganizationMemberRepository,
                verification_repository_1.VerificationRepository,
                password_reset_repository_1.PasswordResetRepository,
                permission_repository_1.PermissionRepository,
                role_repository_1.RoleRepository,
                meta_connection_repository_1.MetaConnectionRepository,
                meta_business_repository_1.MetaBusinessRepository,
                meta_page_repository_1.MetaPageRepository,
                meta_ad_account_repository_1.MetaAdAccountRepository,
                meta_instagram_repository_1.MetaInstagramAccountRepository,
                meta_pixel_repository_1.MetaPixelRepository,
                meta_catalog_repository_1.MetaCatalogRepository,
                meta_sync_history_repository_1.MetaSyncHistoryRepository,
                meta_business_page_repository_1.MetaBusinessPageRepository,
                meta_business_ad_account_repository_1.MetaBusinessAdAccountRepository,
                meta_business_pixel_repository_1.MetaBusinessPixelRepository,
                meta_business_catalog_repository_1.MetaBusinessCatalogRepository,
                meta_page_instagram_repository_1.MetaPageInstagramRepository,
                meta_ad_account_pixel_repository_1.MetaAdAccountPixelRepository,
                campaign_repository_1.CampaignRepository,
                ad_set_repository_1.AdSetRepository,
                ad_creative_repository_1.AdCreativeRepository,
                ad_repository_1.AdRepository,
                media_repository_1.MediaRepository,
                campaign_insight_repository_1.CampaignInsightRepository,
                adset_insight_repository_1.AdSetInsightRepository,
                ad_insight_repository_1.AdInsightRepository,
                meta_insight_repository_1.MetaInsightRepository,
                insight_sync_history_repository_1.InsightSyncHistoryRepository,
                status_sync_history_repository_1.StatusSyncHistoryRepository,
                meta_status_repository_1.MetaStatusRepository,
                campaign_lifecycle_repository_1.CampaignLifecycleRepository,
                adset_lifecycle_repository_1.AdSetLifecycleRepository,
                adcreative_lifecycle_repository_1.AdCreativeLifecycleRepository,
                ad_lifecycle_repository_1.AdLifecycleRepository,
                webhook_inbox_repository_1.WebhookInboxRepository,
                job_repository_1.JobRepository,
                meta_outbox_repository_1.MetaOutboxRepository,
                automation_rule_repository_1.AutomationRuleRepository,
            ],
            exports: [
                constants_1.PRISMA_CLIENT,
                user_repository_1.UserRepository,
                user_session_repository_1.UserSessionRepository,
                user_invitation_repository_1.UserInvitationRepository,
                organization_repository_1.OrganizationRepository,
                workspace_repository_1.WorkspaceRepository,
                organization_member_repository_1.OrganizationMemberRepository,
                verification_repository_1.VerificationRepository,
                password_reset_repository_1.PasswordResetRepository,
                permission_repository_1.PermissionRepository,
                role_repository_1.RoleRepository,
                meta_connection_repository_1.MetaConnectionRepository,
                meta_business_repository_1.MetaBusinessRepository,
                meta_page_repository_1.MetaPageRepository,
                meta_ad_account_repository_1.MetaAdAccountRepository,
                meta_instagram_repository_1.MetaInstagramAccountRepository,
                meta_pixel_repository_1.MetaPixelRepository,
                meta_catalog_repository_1.MetaCatalogRepository,
                meta_sync_history_repository_1.MetaSyncHistoryRepository,
                meta_business_page_repository_1.MetaBusinessPageRepository,
                meta_business_ad_account_repository_1.MetaBusinessAdAccountRepository,
                meta_business_pixel_repository_1.MetaBusinessPixelRepository,
                meta_business_catalog_repository_1.MetaBusinessCatalogRepository,
                meta_page_instagram_repository_1.MetaPageInstagramRepository,
                meta_ad_account_pixel_repository_1.MetaAdAccountPixelRepository,
                campaign_repository_1.CampaignRepository,
                ad_set_repository_1.AdSetRepository,
                ad_creative_repository_1.AdCreativeRepository,
                ad_repository_1.AdRepository,
                media_repository_1.MediaRepository,
                campaign_insight_repository_1.CampaignInsightRepository,
                adset_insight_repository_1.AdSetInsightRepository,
                ad_insight_repository_1.AdInsightRepository,
                meta_insight_repository_1.MetaInsightRepository,
                insight_sync_history_repository_1.InsightSyncHistoryRepository,
                status_sync_history_repository_1.StatusSyncHistoryRepository,
                meta_status_repository_1.MetaStatusRepository,
                campaign_lifecycle_repository_1.CampaignLifecycleRepository,
                adset_lifecycle_repository_1.AdSetLifecycleRepository,
                adcreative_lifecycle_repository_1.AdCreativeLifecycleRepository,
                ad_lifecycle_repository_1.AdLifecycleRepository,
                webhook_inbox_repository_1.WebhookInboxRepository,
                job_repository_1.JobRepository,
                meta_outbox_repository_1.MetaOutboxRepository,
                automation_rule_repository_1.AutomationRuleRepository,
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var DatabaseModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            DatabaseModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return DatabaseModule = _classThis;
})();
exports.DatabaseModule = DatabaseModule;
//# sourceMappingURL=database.module.js.map