import { randomUUID } from 'crypto';

export class RecommendationFactory {
  static build(overrides?: any) {
    return {
      id: randomUUID(),
      workspaceId: randomUUID(),
      provider: 'RULE_BASED',
      recommendationType: 'BUDGET',
      entityType: 'CAMPAIGN',
      entityId: `camp-${randomUUID()}`,
      title: 'Budget optimization template',
      description: 'Recommend reducing budget',
      reason: 'CPA has exceeded target',
      confidenceScore: 0.9,
      expectedImpact: 'Save $100',
      priority: 'HIGH',
      status: 'PENDING',
      recommendationHash: `hash-${randomUUID()}`,
      metadata: {},
      explainability: {},
      ...overrides,
    };
  }

  static buildMany(count: number, overrides?: any) {
    return Array.from({ length: count }, () => this.build(overrides));
  }

  static async create(prisma: any, overrides?: any) {
    const data = this.build(overrides);
    return await prisma.automationRecommendation.create({
      data,
    });
  }

  static async createMany(prisma: any, count: number, overrides?: any) {
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
