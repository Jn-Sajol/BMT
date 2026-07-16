import { IRepository } from '../repository.port';
import { MetaConnection } from '@prisma/client';
export interface IMetaConnectionRepository extends IRepository<MetaConnection> {
    findByWorkspaceId(workspaceId: string): Promise<MetaConnection | null>;
    findByFacebookUserId(facebookUserId: string): Promise<MetaConnection | null>;
}
