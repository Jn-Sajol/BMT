"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationFactory = void 0;
const crypto_1 = require("crypto");
class NotificationFactory {
    static build(overrides) {
        return {
            id: (0, crypto_1.randomUUID)(),
            workspaceId: (0, crypto_1.randomUUID)(),
            userId: (0, crypto_1.randomUUID)(),
            channel: 'EMAIL',
            enabled: true,
            severityLevel: 'INFO',
            ...overrides,
        };
    }
    static buildMany(count, overrides) {
        return Array.from({ length: count }, () => this.build(overrides));
    }
    static async create(prisma, overrides) {
        const data = this.build(overrides);
        return await prisma.automationNotificationPreference.create({
            data,
        });
    }
    static async createMany(prisma, count, overrides) {
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
exports.NotificationFactory = NotificationFactory;
//# sourceMappingURL=notification.factory.js.map