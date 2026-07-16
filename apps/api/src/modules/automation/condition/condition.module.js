"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionModule = void 0;
const common_1 = require("@nestjs/common");
const property_resolver_service_1 = require("./application/services/property-resolver.service");
const condition_resolver_service_1 = require("./application/services/condition-resolver.service");
const condition_registry_1 = require("./infrastructure/registry/condition-registry");
const localization_service_1 = require("./infrastructure/services/localization.service");
const CoreEvaluators = __importStar(require("./infrastructure/evaluators/core-evaluators"));
let ConditionModule = (() => {
    let _classDecorators = [(0, common_1.Module)({
            providers: [
                property_resolver_service_1.PropertyResolver,
                condition_resolver_service_1.ConditionResolver,
                localization_service_1.LocalizationService,
                {
                    provide: 'IConditionRegistry',
                    useClass: condition_registry_1.ConditionRegistry,
                },
                {
                    provide: 'IConditionResolver',
                    useClass: condition_resolver_service_1.ConditionResolver,
                },
                {
                    provide: 'ILocalizationService',
                    useClass: localization_service_1.LocalizationService,
                },
            ],
            exports: [
                property_resolver_service_1.PropertyResolver,
                condition_resolver_service_1.ConditionResolver,
                'IConditionRegistry',
                'IConditionResolver',
                'ILocalizationService',
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ConditionModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ConditionModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        registry;
        localization;
        constructor(registry, localization) {
            this.registry = registry;
            this.localization = localization;
        }
        onModuleInit() {
            this.registry.registerEvaluator(new CoreEvaluators.EqualsEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.EqualsAliasEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.NotEqualsEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.NotEqualsAliasEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.GreaterThanEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.GreaterThanAliasEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.GreaterThanOrEqualEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.GreaterThanOrEqualAliasEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.LessThanEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.LessThanAliasEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.LessThanOrEqualEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.LessThanOrEqualAliasEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.BetweenEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.ContainsEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.StartsWithEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.EndsWithEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.InEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.NotInEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.MatchRegexEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.IsEmptyEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.IsNotEmptyEvaluator());
            this.registry.registerEvaluator(new CoreEvaluators.DayOfWeekEvaluator(this.localization));
            this.registry.registerEvaluator(new CoreEvaluators.TimeWindowEvaluator());
        }
    };
    return ConditionModule = _classThis;
})();
exports.ConditionModule = ConditionModule;
//# sourceMappingURL=condition.module.js.map