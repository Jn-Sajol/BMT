import { OrganizationMember } from '@prisma/client';
import { OrganizationMemberResponseDto } from '../dto/organization-member-response.dto';
export declare class OrganizationMemberMapper {
    static toResponse(member: OrganizationMember): OrganizationMemberResponseDto;
    static toResponseList(members: OrganizationMember[]): OrganizationMemberResponseDto[];
}
