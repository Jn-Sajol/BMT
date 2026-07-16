import { MetaBusinessPageRepository } from '../../../../infrastructure/database/repositories/meta-business-page.repository';
import { MetaBusinessPage } from '@prisma/client';
export declare class MetaBusinessRelationshipService {
    private readonly repo;
    constructor(repo: MetaBusinessPageRepository);
    getByWorkspace(workspaceId: string): Promise<MetaBusinessPage[]>;
}
