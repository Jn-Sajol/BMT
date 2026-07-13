import { randomUUID } from 'crypto';

export class AutomationFactory {
  static build(overrides?: any) {
    return {
      id: randomUUID(),
      workspaceId: randomUUID(),
      name: 'Hardened Automation Rule',
      status: 'ACTIVE',
      ...overrides,
    };
  }

  static buildMany(count: number, overrides?: any) {
    return Array.from({ length: count }, () => this.build(overrides));
  }

  static async create(prisma: any, overrides?: any) {
    return this.build(overrides);
  }
}
