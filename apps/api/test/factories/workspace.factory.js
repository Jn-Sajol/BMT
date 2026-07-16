"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceFactory = void 0;
const crypto_1 = require("crypto");
class WorkspaceFactory {
    static build(overrides) {
        return {
            id: (0, crypto_1.randomUUID)(),
            name: 'Hardened Workspace',
            createdAt: new Date(),
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
exports.WorkspaceFactory = WorkspaceFactory;
//# sourceMappingURL=workspace.factory.js.map