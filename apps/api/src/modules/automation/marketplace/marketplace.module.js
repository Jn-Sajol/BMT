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
exports.MarketplaceModule = void 0;
const common_1 = require("@nestjs/common");
const marketplace_service_1 = require("./application/services/marketplace.service");
const template_search_service_1 = require("./application/services/template-search.service");
const template_publisher_service_1 = require("./application/services/template-publisher.service");
const template_installer_service_1 = require("./application/services/template-installer.service");
const template_version_service_1 = require("./application/services/template-version.service");
const template_review_service_1 = require("./application/services/template-review.service");
const template_analytics_service_1 = require("./application/services/template-analytics.service");
const signature_verifier_service_1 = require("./application/services/signature-verifier.service");
const marketplace_controller_1 = require("./presentation/marketplace.controller");
const action_module_1 = require("../action/action.module");
const database_module_1 = require("../../../infrastructure/database/database.module");
let MarketplaceModule = (() => {
    let _classDecorators = [(0, common_1.Module)({
            imports: [database_module_1.DatabaseModule, action_module_1.ActionModule],
            controllers: [marketplace_controller_1.MarketplaceController],
            providers: [
                marketplace_service_1.MarketplaceService,
                template_search_service_1.TemplateSearchService,
                template_publisher_service_1.TemplatePublisherService,
                template_installer_service_1.TemplateInstallerService,
                template_version_service_1.TemplateVersionService,
                template_review_service_1.TemplateReviewService,
                template_analytics_service_1.TemplateAnalyticsService,
                signature_verifier_service_1.SignatureVerifierService,
                {
                    provide: 'ITemplateInstaller',
                    useClass: template_installer_service_1.TemplateInstallerService,
                },
                {
                    provide: 'ISignatureVerifier',
                    useClass: signature_verifier_service_1.SignatureVerifierService,
                },
                {
                    provide: 'ITemplateSearch',
                    useClass: template_search_service_1.TemplateSearchService,
                },
                {
                    provide: 'ITemplateVersioning',
                    useClass: template_version_service_1.TemplateVersionService,
                },
            ],
            exports: [
                marketplace_service_1.MarketplaceService,
                template_search_service_1.TemplateSearchService,
                template_publisher_service_1.TemplatePublisherService,
                template_installer_service_1.TemplateInstallerService,
                template_version_service_1.TemplateVersionService,
                template_review_service_1.TemplateReviewService,
                template_analytics_service_1.TemplateAnalyticsService,
                signature_verifier_service_1.SignatureVerifierService,
                'ITemplateInstaller',
                'ISignatureVerifier',
                'ITemplateSearch',
                'ITemplateVersioning',
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MarketplaceModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MarketplaceModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return MarketplaceModule = _classThis;
})();
exports.MarketplaceModule = MarketplaceModule;
//# sourceMappingURL=marketplace.module.js.map