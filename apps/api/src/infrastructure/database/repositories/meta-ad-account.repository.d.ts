import { MetaAdAccount } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class MetaAdAccountRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<MetaAdAccount | null>;
    findByWorkspaceId(workspaceId: string): Promise<MetaAdAccount[]>;
    save(entity: MetaAdAccount): Promise<MetaAdAccount>;
}
