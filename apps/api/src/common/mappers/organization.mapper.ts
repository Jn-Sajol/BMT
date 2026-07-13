import { Organization } from '@prisma/client';
import { OrganizationResponseDto } from '../dto/organization-response.dto';

export class OrganizationMapper {
  static toResponse(org: Organization): OrganizationResponseDto {
    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      status: org.status,
      ownerUserId: org.ownerUserId,
      createdAt: org.createdAt.toISOString(),
      updatedAt: org.updatedAt.toISOString(),
    };
  }

  static toResponseList(orgs: Organization[]): OrganizationResponseDto[] {
    return orgs.map(org => this.toResponse(org));
  }
}
