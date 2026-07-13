import { randomUUID } from 'crypto';

export class WorkspaceFactory {
  static build(overrides?: any) {
    return {
      id: randomUUID(),
      name: 'Hardened Workspace',
      createdAt: new Date(),
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
