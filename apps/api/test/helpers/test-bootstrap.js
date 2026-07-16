"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestBootstrap = void 0;
class TestBootstrap {
    static async resetDatabase(prisma) {
        const tables = [
            'automation_template_reviews',
            'automation_template_analytics',
            'automation_template_installations',
            'automation_template_versions',
            'automation_templates',
            'automation_recommendation_history',
            'automation_optimization_scores',
            'automation_recommendations',
        ];
        for (const table of tables) {
            try {
                await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE`);
            }
            catch (err) {
                // Table might not exist yet
            }
        }
    }
    static async seedFixtures(prisma) {
        // Seed configuration hooks
    }
}
exports.TestBootstrap = TestBootstrap;
//# sourceMappingURL=test-bootstrap.js.map