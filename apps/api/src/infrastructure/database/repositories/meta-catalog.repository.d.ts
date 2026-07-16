import { MetaCatalog } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class MetaCatalogRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findByWorkspaceId(workspaceId: string): Promise<MetaCatalog[]>;
    save(entity: MetaCatalog): Promise<MetaCatalog>;
}
