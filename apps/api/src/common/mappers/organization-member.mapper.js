"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationMemberMapper = void 0;
class OrganizationMemberMapper {
    static toResponse(member) {
        return {
            id: member.id,
            organizationId: member.organizationId,
            userId: member.userId,
            status: member.status,
            createdAt: member.createdAt.toISOString(),
            updatedAt: member.updatedAt.toISOString(),
        };
    }
    static toResponseList(members) {
        return members.map(m => this.toResponse(m));
    }
}
exports.OrganizationMemberMapper = OrganizationMemberMapper;
//# sourceMappingURL=organization-member.mapper.js.map