"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationFactory = void 0;
const crypto_1 = require("crypto");
class AutomationFactory {
    static build(overrides) {
        return {
            id: (0, crypto_1.randomUUID)(),
            workspaceId: (0, crypto_1.randomUUID)(),
            name: 'Hardened Automation Rule',
            status: 'ACTIVE',
            ...overrides,
        };
    }
    static buildMany(count, overrides) {
        return Array.from({ length: count }, () => this.build(overrides));
    }
    static async create(prisma, overrides) {
        return this.build(overrides);
    }
}
exports.AutomationFactory = AutomationFactory;
//# sourceMappingURL=automation.factory.js.map