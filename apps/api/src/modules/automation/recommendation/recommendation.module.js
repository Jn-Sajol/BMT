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
exports.RecommendationModule = void 0;
const common_1 = require("@nestjs/common");
const recommendation_provider_registry_1 = require("./infrastructure/registries/recommendation-provider.registry");
const recommendation_explainability_service_1 = require("./application/services/recommendation-explainability.service");
const priority_engine_service_1 = require("./application/services/priority-engine.service");
const recommendation_expiration_service_1 = require("./application/services/recommendation-expiration.service");
const recommendation_score_service_1 = require("./application/services/recommendation-score.service");
const recommendation_engine_service_1 = require("./application/services/recommendation-engine.service");
const recommendation_history_service_1 = require("./application/services/recommendation-history.service");
const recommendation_observer_service_1 = require("./application/services/recommendation-observer.service");
const recommendation_controller_1 = require("./presentation/recommendation.controller");
const action_module_1 = require("../action/action.module");
const database_module_1 = require("../../../infrastructure/database/database.module");
let RecommendationModule = (() => {
    let _classDecorators = [(0, common_1.Module)({
            imports: [database_module_1.DatabaseModule, action_module_1.ActionModule],
            controllers: [recommendation_controller_1.RecommendationController],
            providers: [
                recommendation_provider_registry_1.RecommendationProviderRegistry,
                recommendation_explainability_service_1.RecommendationExplainabilityService,
                priority_engine_service_1.PriorityEngineService,
                recommendation_expiration_service_1.RecommendationExpirationService,
                recommendation_score_service_1.RecommendationScoreService,
                recommendation_engine_service_1.RecommendationEngineService,
                recommendation_history_service_1.RecommendationHistoryService,
                recommendation_observer_service_1.RecommendationObserver,
            ],
            exports: [
                recommendation_provider_registry_1.RecommendationProviderRegistry,
                recommendation_explainability_service_1.RecommendationExplainabilityService,
                priority_engine_service_1.PriorityEngineService,
                recommendation_expiration_service_1.RecommendationExpirationService,
                recommendation_score_service_1.RecommendationScoreService,
                recommendation_engine_service_1.RecommendationEngineService,
                recommendation_history_service_1.RecommendationHistoryService,
                recommendation_observer_service_1.RecommendationObserver,
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RecommendationModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RecommendationModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return RecommendationModule = _classThis;
})();
exports.RecommendationModule = RecommendationModule;
//# sourceMappingURL=recommendation.module.js.map