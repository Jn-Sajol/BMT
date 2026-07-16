import { MetaBusinessRepository } from '../../../../infrastructure/database/repositories/meta-business.repository';
import { MetaBusiness } from '@prisma/client';
export declare class MetaBusinessService {
    private readonly repo;
    constructor(repo: MetaBusinessRepository);
    getByWorkspace(workspaceId: string): Promise<MetaBusiness[]>;
}
