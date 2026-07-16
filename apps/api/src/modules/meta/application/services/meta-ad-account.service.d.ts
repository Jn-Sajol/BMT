import { MetaAdAccountRepository } from '../../../../infrastructure/database/repositories/meta-ad-account.repository';
import { MetaAdAccount } from '@prisma/client';
export declare class MetaAdAccountService {
    private readonly repo;
    constructor(repo: MetaAdAccountRepository);
    getByWorkspace(workspaceId: string): Promise<MetaAdAccount[]>;
}
