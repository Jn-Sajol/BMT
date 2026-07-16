import { MetaConnection } from '@prisma/client';
import { IMetaConnectionRepository } from '../../../common/ports/identity/meta-connection-repository.interface';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class MetaConnectionRepository implements IMetaConnectionRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<MetaConnection | null>;
    findByWorkspaceId(workspaceId: string): Promise<MetaConnection | null>;
    findByFacebookUserId(facebookUserId: string): Promise<MetaConnection | null>;
    findAll(): Promise<MetaConnection[]>;
    save(entity: MetaConnection): Promise<MetaConnection>;
    delete(id: string): Promise<void>;
}
