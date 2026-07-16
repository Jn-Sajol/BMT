import { Organization } from '@prisma/client';
import { IOrganizationRepository } from '../../../common/ports/organization-repository.interface';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class OrganizationRepository implements IOrganizationRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<Organization | null>;
    findBySlug(slug: string): Promise<Organization | null>;
    findAll(): Promise<Organization[]>;
    save(entity: Organization): Promise<Organization>;
    delete(id: string): Promise<void>;
}
