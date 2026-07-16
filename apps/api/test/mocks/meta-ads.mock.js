"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaAdsMock = void 0;
class MetaAdsMock {
    async updateAdSetBudget(adSetId, budget) {
        return {
            success: true,
            adSetId,
            updatedBudget: budget,
            timestamp: new Date().toISOString(),
        };
    }
    async getAdSetPerformance(adSetId) {
        return {
            adSetId,
            cpa: 15.5,
            ctr: 0.024,
            impressions: 12000,
        };
    }
}
exports.MetaAdsMock = MetaAdsMock;
//# sourceMappingURL=meta-ads.mock.js.map