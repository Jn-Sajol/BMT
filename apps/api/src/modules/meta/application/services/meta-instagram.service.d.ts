import { MetaInstagramAccountRepository } from '../../../../infrastructure/database/repositories/meta-instagram.repository';
import { MetaInstagramAccount } from '@prisma/client';
export declare class MetaInstagramService {
    private readonly repo;
    constructor(repo: MetaInstagramAccountRepository);
    getByWorkspace(workspaceId: string): Promise<MetaInstagramAccount[]>;
}
