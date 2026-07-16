import { ExtendedPrismaClient } from '../../src/infrastructure/database/prisma-extensions';
export declare class TestBootstrap {
    static resetDatabase(prisma: ExtendedPrismaClient): Promise<void>;
    static seedFixtures(prisma: ExtendedPrismaClient): Promise<void>;
}
