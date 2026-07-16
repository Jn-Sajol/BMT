import { MetaAdAccountPixel } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class MetaAdAccountPixelRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findByWorkspaceId(workspaceId: string): Promise<MetaAdAccountPixel[]>;
    save(entity: MetaAdAccountPixel): Promise<MetaAdAccountPixel>;
}
