"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationMapper = void 0;
class OrganizationMapper {
    static toResponse(org) {
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
    static toResponseList(orgs) {
        return orgs.map(org => this.toResponse(org));
    }
}
exports.OrganizationMapper = OrganizationMapper;
//# sourceMappingURL=organization.mapper.js.map