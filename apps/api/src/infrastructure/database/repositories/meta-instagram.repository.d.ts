import { MetaInstagramAccount } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class MetaInstagramAccountRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<MetaInstagramAccount | null>;
    findByWorkspaceId(workspaceId: string): Promise<MetaInstagramAccount[]>;
    save(entity: MetaInstagramAccount): Promise<MetaInstagramAccount>;
}
