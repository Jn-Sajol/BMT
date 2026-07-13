import { randomUUID } from 'crypto';

export class UserFactory {
  static build(overrides?: any) {
    return {
      id: randomUUID(),
      email: 'test@bmt.io',
      name: 'BMT Hardened User',
      role: 'ADMIN',
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
