"use strict";
// Organization Member Domain Database Seeding script
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedOrganizationMember = seedOrganizationMember;
async function seedOrganizationMember(prisma) {
    console.log('Seeding Organization Member domain...');
    // 1. Fetch the default demo organization
    const demoOrgSlug = 'demo-agency';
    const org = await prisma.organization.findUnique({
        where: { slug: demoOrgSlug },
    });
    if (!org) {
        console.warn(`Cannot seed organization memberships: Demo organization '${demoOrgSlug}' not found.`);
        return;
    }
    // 2. Fetch the owner user of the demo organization
    const owner = await prisma.user.findUnique({
        where: { id: org.ownerUserId },
    });
    if (!owner) {
        console.warn(`Cannot seed organization membership: Owner user '${org.ownerUserId}' not found.`);
        return;
    }
    // 3. Create active organization member record for the owner
    const existingMember = await prisma.organizationMember.findUnique({
        where: {
            organizationId_userId: {
                organizationId: org.id,
                userId: owner.id,
            },
        },
    });
    if (!existingMember) {
        await prisma.organizationMember.create({
            data: {
                organizationId: org.id,
                userId: owner.id,
                status: 'ACTIVE',
            },
        });
        console.log(`Successfully seeded owner '${owner.email}' as an ACTIVE member of organization '${org.slug}'.`);
    }
    else {
        console.log(`Owner membership already exists for organization '${org.slug}'.`);
    }
}
//# sourceMappingURL=organization-member.seed.js.map