import { Organization } from '@prisma/client';
import { OrganizationResponseDto } from '../dto/organization-response.dto';
export declare class OrganizationMapper {
    static toResponse(org: Organization): OrganizationResponseDto;
    static toResponseList(orgs: Organization[]): OrganizationResponseDto[];
}
