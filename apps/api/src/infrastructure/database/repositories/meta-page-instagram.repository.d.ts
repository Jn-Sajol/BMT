import { MetaPageInstagram } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class MetaPageInstagramRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findByWorkspaceId(workspaceId: string): Promise<MetaPageInstagram[]>;
    save(entity: MetaPageInstagram): Promise<MetaPageInstagram>;
}
