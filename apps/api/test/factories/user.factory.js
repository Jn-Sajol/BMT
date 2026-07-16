"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFactory = void 0;
const crypto_1 = require("crypto");
class UserFactory {
    static build(overrides) {
        return {
            id: (0, crypto_1.randomUUID)(),
            email: 'test@bmt.io',
            name: 'BMT Hardened User',
            role: 'ADMIN',
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
exports.UserFactory = UserFactory;
//# sourceMappingURL=user.factory.js.map