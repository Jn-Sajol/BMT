import { MetaBusinessCatalog } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class MetaBusinessCatalogRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findByWorkspaceId(workspaceId: string): Promise<MetaBusinessCatalog[]>;
    save(entity: MetaBusinessCatalog): Promise<MetaBusinessCatalog>;
}
