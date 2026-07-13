import { randomUUID } from 'crypto';

export class NotificationFactory {
  static build(overrides?: any) {
    return {
      id: randomUUID(),
      workspaceId: randomUUID(),
      userId: randomUUID(),
      channel: 'EMAIL',
      enabled: true,
      severityLevel: 'INFO',
      ...overrides,
    };
  }

  static buildMany(count: number, overrides?: any) {
    return Array.from({ length: count }, () => this.build(overrides));
  }

  static async create(prisma: any, overrides?: any) {
    const data = this.build(overrides);
    return await prisma.automationNotificationPreference.create({
      data,
    });
  }

  static async createMany(prisma: any, count: number, overrides?: any) {
    const list = this.buildMany(count, overrides);
    const results = [];
    for (const item of list) {
      const res = await prisma.automationNotificationPreference.create({
        data: item,
      });
      results.push(res);
    }
    return results;
  }
}
