import { MetaPageInstagramRepository } from '../../../../infrastructure/database/repositories/meta-page-instagram.repository';
import { MetaPageInstagram } from '@prisma/client';
export declare class MetaPageRelationshipService {
    private readonly repo;
    constructor(repo: MetaPageInstagramRepository);
    getByWorkspace(workspaceId: string): Promise<MetaPageInstagram[]>;
}
