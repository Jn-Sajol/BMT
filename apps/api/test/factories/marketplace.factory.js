"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceTemplateFactory = void 0;
const crypto_1 = require("crypto");
class MarketplaceTemplateFactory {
    static build(overrides) {
        return {
            id: (0, crypto_1.randomUUID)(),
            workspaceId: (0, crypto_1.randomUUID)(),
            name: `Template-${(0, crypto_1.randomUUID)()}`,
            description: 'Mock Marketplace Template description',
            visibility: 'COMMUNITY',
            activeVersion: '1.0.0',
            authorId: (0, crypto_1.randomUUID)(),
            ...overrides,
        };
    }
    static buildMany(count, overrides) {
        return Array.from({ length: count }, () => this.build(overrides));
    }
    static async create(prisma, overrides) {
        const data = this.build(overrides);
        return await prisma.automationTemplate.create({
            data,
        });
    }
    static async createMany(prisma, count, overrides) {
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
exports.MarketplaceTemplateFactory = MarketplaceTemplateFactory;
//# sourceMappingURL=marketplace.factory.js.map