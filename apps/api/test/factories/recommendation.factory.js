"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationFactory = void 0;
const crypto_1 = require("crypto");
class RecommendationFactory {
    static build(overrides) {
        return {
            id: (0, crypto_1.randomUUID)(),
            workspaceId: (0, crypto_1.randomUUID)(),
            provider: 'RULE_BASED',
            recommendationType: 'BUDGET',
            entityType: 'CAMPAIGN',
            entityId: `camp-${(0, crypto_1.randomUUID)()}`,
            title: 'Budget optimization template',
            description: 'Recommend reducing budget',
            reason: 'CPA has exceeded target',
            confidenceScore: 0.9,
            expectedImpact: 'Save $100',
            priority: 'HIGH',
            status: 'PENDING',
            recommendationHash: `hash-${(0, crypto_1.randomUUID)()}`,
            metadata: {},
            explainability: {},
            ...overrides,
        };
    }
    static buildMany(count, overrides) {
        return Array.from({ length: count }, () => this.build(overrides));
    }
    static async create(prisma, overrides) {
        const data = this.build(overrides);
        return await prisma.automationRecommendation.create({
            data,
        });
    }
    static async createMany(prisma, count, overrides) {
        const list = this.buildMany(count, overrides);
        const results = [];
        for (const item of list) {
            const res = await prisma.automationRecommendation.create({
                data: item,
            });
            results.push(res);
        }
        return results;
    }
}
exports.RecommendationFactory = RecommendationFactory;
//# sourceMappingURL=recommendation.factory.js.map