import { Permission } from '@prisma/client';
import { IPermissionRepository } from '../../../common/ports/identity/permission-repository.interface';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class PermissionRepository implements IPermissionRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<Permission | null>;
    findByActionKey(actionKey: string): Promise<Permission | null>;
    findManyByActionKeys(actionKeys: string[]): Promise<Permission[]>;
    findAll(): Promise<Permission[]>;
    save(entity: Permission): Promise<Permission>;
    delete(id: string): Promise<void>;
}
