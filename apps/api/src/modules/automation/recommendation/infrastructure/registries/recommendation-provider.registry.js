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
exports.RecommendationProviderRegistry = exports.InternalMlRecommendationProvider = exports.GeminiRecommendationProvider = exports.ClaudeRecommendationProvider = exports.GptRecommendationProvider = exports.RuleBasedRecommendationProvider = void 0;
const common_1 = require("@nestjs/common");
class RuleBasedRecommendationProvider {
    providerName() { return 'RULE_BASED'; }
    providerVersion() { return '1.0'; }
    supports(entityType) { return true; }
    async validate(payload) { return true; }
    async generate(workspaceId) {
        return [
            {
                recommendationType: 'BUDGET',
                entityType: 'CAMPAIGN',
                entityId: 'campaign-101',
                title: 'High CPA Budget Optimization Alert',
                description: 'CPA has exceeded standard threshold of $20. Recommend reducing budget by 20%.',
                reason: 'Campaign campaign-101 CPA is currently $24.50.',
                confidenceScore: 0.85,
                expectedImpact: 'Potential savings: $250.00 / week',
                priority: 'HIGH',
                metadata: { budgetChange: -0.2, currentCPA: 24.5 },
            },
        ];
    }
}
exports.RuleBasedRecommendationProvider = RuleBasedRecommendationProvider;
class GptRecommendationProvider {
    providerName() { return 'GPT'; }
    providerVersion() { return '4.0'; }
    supports(entityType) { return entityType === 'CAMPAIGN' || entityType === 'CREATIVE'; }
    async validate(payload) { return true; }
    async generate(workspaceId) { return []; }
}
exports.GptRecommendationProvider = GptRecommendationProvider;
class ClaudeRecommendationProvider {
    providerName() { return 'CLAUDE'; }
    providerVersion() { return '3.5'; }
    supports(entityType) { return true; }
    async validate(payload) { return true; }
    async generate(workspaceId) { return []; }
}
exports.ClaudeRecommendationProvider = ClaudeRecommendationProvider;
class GeminiRecommendationProvider {
    providerName() { return 'GEMINI'; }
    providerVersion() { return '1.5'; }
    supports(entityType) { return true; }
    async validate(payload) { return true; }
    async generate(workspaceId) { return []; }
}
exports.GeminiRecommendationProvider = GeminiRecommendationProvider;
class InternalMlRecommendationProvider {
    providerName() { return 'INTERNAL_ML'; }
    providerVersion() { return '2.0'; }
    supports(entityType) { return true; }
    async validate(payload) { return true; }
    async generate(workspaceId) { return []; }
}
exports.InternalMlRecommendationProvider = InternalMlRecommendationProvider;
let RecommendationProviderRegistry = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RecommendationProviderRegistry = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RecommendationProviderRegistry = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        providers = new Map();
        constructor() {
            this.register(new RuleBasedRecommendationProvider());
            this.register(new GptRecommendationProvider());
            this.register(new ClaudeRecommendationProvider());
            this.register(new GeminiRecommendationProvider());
            this.register(new InternalMlRecommendationProvider());
        }
        register(provider) {
            this.providers.set(provider.providerName().toUpperCase(), provider);
        }
        resolve(name) {
            return this.providers.get(name.toUpperCase());
        }
        getAll() {
            return Array.from(this.providers.values());
        }
    };
    return RecommendationProviderRegistry = _classThis;
})();
exports.RecommendationProviderRegistry = RecommendationProviderRegistry;
//# sourceMappingURL=recommendation-provider.registry.js.map