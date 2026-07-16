import { MetaBusinessPage } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class MetaBusinessPageRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findByWorkspaceId(workspaceId: string): Promise<MetaBusinessPage[]>;
    save(entity: MetaBusinessPage): Promise<MetaBusinessPage>;
}
