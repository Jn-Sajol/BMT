import { MetaBusinessPixel } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class MetaBusinessPixelRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findByWorkspaceId(workspaceId: string): Promise<MetaBusinessPixel[]>;
    save(entity: MetaBusinessPixel): Promise<MetaBusinessPixel>;
}
