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
exports.AutomationModule = void 0;
const common_1 = require("@nestjs/common");
const automation_controller_1 = require("./presentation/automation.controller");
const automation_rule_service_1 = require("./application/services/automation-rule.service");
const automation_validation_service_1 = require("./application/services/automation-validation.service");
const automation_evaluator_service_1 = require("./application/services/automation-evaluator.service");
const automation_dispatcher_service_1 = require("./application/services/automation-dispatcher.service");
const automation_execution_engine_1 = require("./application/services/automation-execution-engine");
const trigger_engine_service_1 = require("./application/services/trigger-engine.service");
const trigger_resolver_service_1 = require("./application/services/trigger-resolver.service");
const trigger_registry_1 = require("./infrastructure/registry/trigger-registry");
const meta_trigger_provider_1 = require("./infrastructure/providers/meta-trigger-provider");
const automation_mapper_1 = require("./application/mapper/automation.mapper");
const database_module_1 = require("../../infrastructure/database/database.module");
const security_module_1 = require("../../infrastructure/security/security.module");
const auth_module_1 = require("../../application/auth/auth.module");
const meta_module_1 = require("../meta/meta.module");
const condition_module_1 = require("./condition/condition.module");
const action_module_1 = require("./action/action.module");
const analytics_module_1 = require("./analytics/analytics.module");
const provider_capability_registry_module_1 = require("./provider-registry/provider-capability-registry.module");
const insights_module_1 = require("./insights/insights.module");
const scheduler_module_1 = require("./scheduler/scheduler.module");
const reliability_module_1 = require("./reliability/reliability.module");
const designer_module_1 = require("./designer/designer.module");
const notification_module_1 = require("./notification/notification.module");
const recommendation_module_1 = require("./recommendation/recommendation.module");
const marketplace_module_1 = require("./marketplace/marketplace.module");
let AutomationModule = (() => {
    let _classDecorators = [(0, common_1.Module)({
            imports: [
                database_module_1.DatabaseModule,
                security_module_1.SecurityModule,
                auth_module_1.AuthModule,
                meta_module_1.MetaModule,
                condition_module_1.ConditionModule,
                action_module_1.ActionModule,
                analytics_module_1.AnalyticsModule,
                provider_capability_registry_module_1.ProviderCapabilityRegistryModule,
                insights_module_1.InsightsModule,
                scheduler_module_1.SchedulerModule,
                reliability_module_1.ReliabilityModule,
                designer_module_1.DesignerModule,
                notification_module_1.NotificationModule,
                recommendation_module_1.RecommendationModule,
                marketplace_module_1.MarketplaceModule,
            ],
            controllers: [automation_controller_1.AutomationController],
            providers: [
                automation_rule_service_1.AutomationRuleService,
                automation_validation_service_1.AutomationValidationService,
                automation_evaluator_service_1.AutomationEvaluator,
                automation_dispatcher_service_1.AutomationDispatcher,
                automation_execution_engine_1.AutomationExecutionEngine,
                trigger_engine_service_1.TriggerEngine,
                meta_trigger_provider_1.MetaTriggerProvider,
                automation_mapper_1.AutomationMapper,
                {
                    provide: 'ITriggerRegistry',
                    useClass: trigger_registry_1.TriggerRegistry,
                },
                {
                    provide: 'ITriggerResolver',
                    useClass: trigger_resolver_service_1.TriggerResolver,
                },
                {
                    provide: 'TRIGGER_VALIDATORS',
                    useFactory: () => [],
                },
                {
                    provide: 'CONDITION_VALIDATORS',
                    useFactory: () => [],
                },
                {
                    provide: 'ACTION_VALIDATORS',
                    useFactory: () => [],
                },
                {
                    provide: 'AUTOMATION_LIFECYCLE_HOOKS',
                    useFactory: () => [],
                },
            ],
            exports: [
                automation_rule_service_1.AutomationRuleService,
                automation_execution_engine_1.AutomationExecutionEngine,
                trigger_engine_service_1.TriggerEngine,
                'ITriggerRegistry',
                'ITriggerResolver',
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AutomationModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AutomationModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        registry;
        metaProvider;
        constructor(registry, metaProvider) {
            this.registry = registry;
            this.metaProvider = metaProvider;
        }
        onModuleInit() {
            this.registry.registerProvider(this.metaProvider);
        }
    };
    return AutomationModule = _classThis;
})();
exports.AutomationModule = AutomationModule;
//# sourceMappingURL=automation.module.js.map