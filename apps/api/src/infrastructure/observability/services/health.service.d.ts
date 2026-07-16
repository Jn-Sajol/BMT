import { ExtendedPrismaClient } from '../../database/prisma-extensions';
export declare class HealthService {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    checkDatabase(): Promise<boolean>;
    checkStorage(): Promise<boolean>;
    checkQueue(): Promise<boolean>;
    checkFullStatus(): Promise<any>;
}
