export declare class CreateOrganizationDto {
    name: string;
    slug: string;
    ownerUserId: string;
}
export declare class UpdateOrganizationDto {
    name?: string;
    slug?: string;
}
export declare class OrganizationListDto {
    limit?: number;
    offset?: number;
    status?: string;
}
