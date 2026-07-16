import { MetaBusiness } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class MetaBusinessRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findByWorkspaceId(workspaceId: string): Promise<MetaBusiness[]>;
    save(entity: MetaBusiness): Promise<MetaBusiness>;
}
