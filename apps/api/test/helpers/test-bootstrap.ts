import { PRISMA_CLIENT } from '../../src/infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../src/infrastructure/database/prisma-extensions';

export class TestBootstrap {
  static async resetDatabase(prisma: ExtendedPrismaClient) {
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
      } catch (err) {
        // Table might not exist yet
      }
    }
  }

  static async seedFixtures(prisma: ExtendedPrismaClient) {
    // Seed configuration hooks
  }
}
