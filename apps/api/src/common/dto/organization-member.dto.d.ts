import { MembershipStatus } from '@prisma/client';
export declare class CreateOrganizationMemberDto {
    organizationId: string;
    userId: string;
    status?: MembershipStatus;
}
export declare class UpdateOrganizationMemberDto {
    status: MembershipStatus;
}
export declare class OrganizationMemberListDto {
    organizationId: string;
    limit?: number;
    offset?: number;
    status?: MembershipStatus;
}
