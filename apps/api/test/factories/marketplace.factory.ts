import { randomUUID } from 'crypto';

export class MarketplaceTemplateFactory {
  static build(overrides?: any) {
    return {
      id: randomUUID(),
      workspaceId: randomUUID(),
      name: `Template-${randomUUID()}`,
      description: 'Mock Marketplace Template description',
      visibility: 'COMMUNITY',
      activeVersion: '1.0.0',
      authorId: randomUUID(),
      ...overrides,
    };
  }

  static buildMany(count: number, overrides?: any) {
    return Array.from({ length: count }, () => this.build(overrides));
  }

  static async create(prisma: any, overrides?: any) {
    const data = this.build(overrides);
    return await prisma.automationTemplate.create({
      data,
    });
  }

  static async createMany(prisma: any, count: number, overrides?: any) {
    const list = this.buildMany(count, overrides);
    const results = [];
    for (const item of list) {
      const res = await prisma.automationTemplate.create({
        data: item,
      });
      results.push(res);
    }
    return results;
  }
}
