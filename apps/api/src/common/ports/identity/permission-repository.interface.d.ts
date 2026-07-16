import { IRepository } from '../repository.port';
import { Permission } from '@prisma/client';
export interface IPermissionRepository extends IRepository<Permission> {
    findByActionKey(actionKey: string): Promise<Permission | null>;
    findManyByActionKeys(actionKeys: string[]): Promise<Permission[]>;
}
