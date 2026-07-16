import { Organization } from '@prisma/client';
import { CreateOrganizationDto, UpdateOrganizationDto, OrganizationListDto } from '../dto/organization.dto';
export interface IOrganizationService {
    create(dto: CreateOrganizationDto): Promise<Organization>;
    findById(id: string): Promise<Organization | null>;
    findBySlug(slug: string): Promise<Organization | null>;
    update(id: string, dto: UpdateOrganizationDto): Promise<Organization>;
    archive(id: string): Promise<Organization>;
    restore(id: string): Promise<Organization>;
    list(dto: OrganizationListDto): Promise<Organization[]>;
}
