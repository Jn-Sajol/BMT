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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const health_module_1 = require("./health/health.module");
const database_module_1 = require("./infrastructure/database/database.module");
const identity_module_1 = require("./application/identity.module");
const security_module_1 = require("./infrastructure/security/security.module");
const auth_module_1 = require("./application/auth/auth.module");
const registration_module_1 = require("./application/registration/registration.module");
const organization_module_1 = require("./application/organization.module");
const workspace_module_1 = require("./application/workspace.module");
const organization_member_module_1 = require("./application/organization-member.module");
const verification_module_1 = require("./application/verification.module");
const password_reset_module_1 = require("./application/password-reset.module");
const rbac_module_1 = require("./application/rbac.module");
const meta_module_1 = require("./modules/meta/meta.module");
const webhook_module_1 = require("./modules/webhook/webhook.module");
const scheduler_module_1 = require("./modules/scheduler/scheduler.module");
const automation_module_1 = require("./modules/automation/automation.module");
const campaign_module_1 = require("./application/campaign/campaign.module");
const adset_module_1 = require("./application/adset/adset.module");
const adcreative_module_1 = require("./application/adcreative/adcreative.module");
const ad_module_1 = require("./application/ad/ad.module");
const media_module_1 = require("./application/media/media.module");
const request_id_middleware_1 = require("./common/middleware/request-id.middleware");
const request_context_middleware_1 = require("./common/context/request-context.middleware");
const observability_module_1 = require("./infrastructure/observability/observability.module");
let AppModule = (() => {
    let _classDecorators = [(0, common_1.Module)({
            imports: [
                health_module_1.HealthModule,
                database_module_1.DatabaseModule,
                identity_module_1.IdentityModule,
                security_module_1.SecurityModule,
                auth_module_1.AuthModule,
                registration_module_1.RegistrationModule,
                organization_module_1.OrganizationModule,
                workspace_module_1.WorkspaceModule,
                organization_member_module_1.OrganizationMemberModule,
                verification_module_1.VerificationModule,
                password_reset_module_1.PasswordResetModule,
                rbac_module_1.RbacModule,
                meta_module_1.MetaModule,
                webhook_module_1.WebhookModule,
                scheduler_module_1.SchedulerModule,
                automation_module_1.AutomationModule,
                campaign_module_1.CampaignModule,
                adset_module_1.AdSetModule,
                adcreative_module_1.AdCreativeModule,
                ad_module_1.AdModule,
                media_module_1.MediaModule,
                observability_module_1.ObservabilityModule,
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AppModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AppModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        configure(consumer) {
            consumer
                .apply(request_id_middleware_1.RequestIdMiddleware, request_context_middleware_1.RequestContextMiddleware)
                .forRoutes('*');
        }
    };
    return AppModule = _classThis;
})();
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map