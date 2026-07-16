import { MetaPixel } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class MetaPixelRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findByWorkspaceId(workspaceId: string): Promise<MetaPixel[]>;
    save(entity: MetaPixel): Promise<MetaPixel>;
}
