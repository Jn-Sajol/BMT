"use strict";
// Identity Domain Database Seeding script
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedIdentity = seedIdentity;
async function seedIdentity(prisma) {
    console.log('Seeding Identity domain...');
    // Create a default administrator user placeholder
    const adminEmail = 'admin@jnsmarketing.local';
    const existingUser = await prisma.user.findUnique({
        where: { email: adminEmail },
    });
    if (!existingUser) {
        await prisma.user.create({
            data: {
                email: adminEmail,
                name: 'System Admin',
                passwordHash: '$2b$12$securepasswordhashplaceholderforlocaldevonly',
                status: 'ACTIVE',
            },
        });
        console.log(`Created default system administrator: ${adminEmail}`);
    }
    else {
        console.log(`Administrator user already exists: ${adminEmail}`);
    }
}
//# sourceMappingURL=identity.seed.js.map