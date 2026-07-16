import { MetaBusinessAdAccount } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class MetaBusinessAdAccountRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findByWorkspaceId(workspaceId: string): Promise<MetaBusinessAdAccount[]>;
    save(entity: MetaBusinessAdAccount): Promise<MetaBusinessAdAccount>;
}
