import { IRepository } from './repository.port';
import { Organization } from '@prisma/client';
export interface IOrganizationRepository extends IRepository<Organization> {
    findBySlug(slug: string): Promise<Organization | null>;
}
