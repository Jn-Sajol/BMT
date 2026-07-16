import { MetaPage } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class MetaPageRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<MetaPage | null>;
    findByWorkspaceId(workspaceId: string): Promise<MetaPage[]>;
    save(entity: MetaPage): Promise<MetaPage>;
}
