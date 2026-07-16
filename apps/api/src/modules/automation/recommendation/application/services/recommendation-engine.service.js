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
exports.RecommendationEngineService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let RecommendationEngineService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RecommendationEngineService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RecommendationEngineService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        registry;
        explainability;
        priorityEngine;
        prisma;
        eventBus;
        constructor(registry, explainability, priorityEngine, prisma, eventBus) {
            this.registry = registry;
            this.explainability = explainability;
            this.priorityEngine = priorityEngine;
            this.prisma = prisma;
            this.eventBus = eventBus;
        }
        async evaluateAndGenerate(workspaceId) {
            const providers = this.registry.getAll();
            for (const provider of providers) {
                try {
                    const rawRecommendations = await provider.generate(workspaceId);
                    for (const raw of rawRecommendations) {
                        const cpaDeviation = 1.8;
                        const calculatedPriority = this.priorityEngine.calculatePriority(raw.confidenceScore, cpaDeviation);
                        const metricWindow = '7d';
                        const recommendationVersion = provider.providerVersion();
                        const hashString = `${provider.providerName()}_${raw.entityId}_${raw.recommendationType}_${metricWindow}_${recommendationVersion}`;
                        const recommendationHash = (0, crypto_1.createHash)('sha256').update(hashString).digest('hex');
                        const existing = await this.prisma.automationRecommendation.findUnique({
                            where: { recommendationHash },
                        });
                        if (existing)
                            continue;
                        const explainPayload = this.explainability.generatePayload({ currentCPA: raw.metadata?.currentCPA || 24.50 }, { targetCPA: 20.00 }, raw.description, raw.confidenceScore, raw.expectedImpact);
                        const rec = await this.prisma.automationRecommendation.create({
                            data: {
                                workspaceId,
                                provider: provider.providerName(),
                                recommendationType: raw.recommendationType,
                                entityType: raw.entityType,
                                entityId: raw.entityId,
                                title: raw.title,
                                description: raw.description,
                                reason: raw.reason,
                                confidenceScore: raw.confidenceScore,
                                expectedImpact: raw.expectedImpact,
                                priority: calculatedPriority,
                                status: 'PENDING',
                                recommendationHash,
                                expiresAt: new Date(Date.now() + 86400000 * 3),
                                metadata: raw.metadata || {},
                                explainability: explainPayload,
                            },
                        });
                        await this.prisma.automationRecommendationHistory.create({
                            data: {
                                recommendationId: rec.id,
                                status: 'PENDING',
                            },
                        });
                        await this.updateDashboardCounts(workspaceId);
                        await this.publishEvent('Recommendation Generated', workspaceId, rec.id, {
                            recommendationId: rec.id,
                            recommendationHash,
                        });
                    }
                }
                catch (err) {
                    console.error(`Recommendation provider ${provider.providerName()} failed:`, err);
                }
            }
        }
        async updateDashboardCounts(workspaceId) {
            const pending = await this.prisma.automationRecommendation.count({
                where: { workspaceId, status: 'PENDING' },
            });
            const accepted = await this.prisma.automationRecommendation.count({
                where: { workspaceId, status: 'ACCEPTED' },
            });
            const rejected = await this.prisma.automationRecommendation.count({
                where: { workspaceId, status: 'REJECTED' },
            });
            await this.prisma.automationRecommendationDashboardProjection.upsert({
                where: { workspaceId },
                update: {
                    pendingCount: pending,
                    acceptedCount: accepted,
                    rejectedCount: rejected,
                    updatedAt: new Date(),
                },
                create: {
                    workspaceId,
                    pendingCount: pending,
                    acceptedCount: accepted,
                    rejectedCount: rejected,
                    optimizationScore: 85.0,
                    automationHealth: 90.0,
                    potentialSavings: 350.0,
                    potentialRevenue: 1200.0,
                },
            });
        }
        async publishEvent(name, workspaceId, causationId, payload) {
            const event = {
                id: (0, crypto_1.randomUUID)(),
                name,
                workspaceId,
                payload: {
                    entityId: causationId,
                    ...payload,
                },
                triggerVersion: '1.0',
                source: 'Recommendation Engine',
                correlationId: (0, crypto_1.randomUUID)(),
                causationId,
                occurredAt: new Date(),
                receivedAt: new Date(),
                processedAt: new Date(),
                timestamp: new Date(),
            };
            await this.eventBus.publish(event);
        }
    };
    return RecommendationEngineService = _classThis;
})();
exports.RecommendationEngineService = RecommendationEngineService;
//# sourceMappingURL=recommendation-engine.service.js.map