import { Organization } from '@prisma/client';
import { CreateOrganizationDto, UpdateOrganizationDto, OrganizationListDto } from '../../common/dto/organization.dto';
import { IOrganizationService } from '../../common/ports/organization-service.interface';
import { OrganizationRepository } from '../../infrastructure/database/repositories/organization.repository';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
export declare class OrganizationService implements IOrganizationService {
    private readonly orgRepo;
    private readonly userRepo;
    constructor(orgRepo: OrganizationRepository, userRepo: UserRepository);
    create(dto: CreateOrganizationDto): Promise<Organization>;
    findById(id: string): Promise<Organization | null>;
    findBySlug(slug: string): Promise<Organization | null>;
    update(id: string, dto: UpdateOrganizationDto): Promise<Organization>;
    archive(id: string): Promise<Organization>;
    restore(id: string): Promise<Organization>;
    list(dto: OrganizationListDto): Promise<Organization[]>;
}
