import { Injectable } from '@nestjs/common';
import { Organization } from '@prisma/client';
import { CreateOrganizationDto, UpdateOrganizationDto, OrganizationListDto } from '../../common/dto/organization.dto';
import { IOrganizationService } from '../../common/ports/organization-service.interface';
import { OrganizationRepository } from '../../infrastructure/database/repositories/organization.repository';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { 
  DuplicateSlugException, 
  OwnerNotFoundException, 
  OrganizationNotFoundException 
} from '../../common/exceptions/organization-exceptions';

@Injectable()
export class OrganizationService implements IOrganizationService {
  constructor(
    private readonly orgRepo: OrganizationRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async create(dto: CreateOrganizationDto): Promise<Organization> {
    // 1. Validate owner existence
    const owner = await this.userRepo.findById(dto.ownerUserId);
    if (!owner) {
      throw new OwnerNotFoundException(dto.ownerUserId);
    }

    // 2. Validate slug uniqueness
    const existing = await this.orgRepo.findBySlug(dto.slug);
    if (existing) {
      throw new DuplicateSlugException(dto.slug);
    }

    const org: Organization = {
      id: '',
      name: dto.name,
      slug: dto.slug.toLowerCase(),
      status: 'ACTIVE',
      ownerUserId: dto.ownerUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    return await this.orgRepo.save(org);
  }

  async findById(id: string): Promise<Organization | null> {
    const org = await this.orgRepo.findById(id);
    if (!org || org.deletedAt) {
      return null;
    }
    return org;
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const org = await this.orgRepo.findBySlug(slug);
    if (!org || org.deletedAt) {
      return null;
    }
    return org;
  }

  async update(id: string, dto: UpdateOrganizationDto): Promise<Organization> {
    const org = await this.orgRepo.findById(id);
    if (!org || org.deletedAt) {
      throw new OrganizationNotFoundException(id);
    }

    if (dto.slug && dto.slug.toLowerCase() !== org.slug) {
      const existing = await this.orgRepo.findBySlug(dto.slug.toLowerCase());
      if (existing) {
        throw new DuplicateSlugException(dto.slug);
      }
      org.slug = dto.slug.toLowerCase();
    }

    if (dto.name) {
      org.name = dto.name;
    }

    org.updatedAt = new Date();
    return await this.orgRepo.save(org);
  }

  async archive(id: string): Promise<Organization> {
    const org = await this.orgRepo.findById(id);
    if (!org || org.deletedAt) {
      throw new OrganizationNotFoundException(id);
    }

    org.status = 'ARCHIVED';
    org.deletedAt = new Date(); // Soft delete triggers in Prisma extensions
    org.updatedAt = new Date();
    return await this.orgRepo.save(org);
  }

  async restore(id: string): Promise<Organization> {
    // Query directly bypassing soft-delete (using prisma direct fetch in repo)
    const org = await this.orgRepo.findById(id);
    if (!org) {
      throw new OrganizationNotFoundException(id);
    }

    org.status = 'ACTIVE';
    org.deletedAt = null;
    org.updatedAt = new Date();
    return await this.orgRepo.save(org);
  }

  async list(dto: OrganizationListDto): Promise<Organization[]> {
    // Prisma findMany automatically appends deletedAt: null from extensions
    const orgs = await this.orgRepo.findAll();
    let filtered = orgs;

    if (dto.status) {
      filtered = filtered.filter(o => o.status === dto.status);
    }

    const limit = dto.limit || 10;
    const offset = dto.offset || 0;

    return filtered.slice(offset, offset + limit);
  }
}
