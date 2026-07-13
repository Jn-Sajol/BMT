// Organization Domain Database Seeding script

export async function seedOrganization(prisma: any) {
  console.log('Seeding Organization domain...');

  // 1. Fetch the default administrator user seeded in Identity
  const adminEmail = 'admin@jnsmarketing.local';
  const admin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!admin) {
    console.warn(`Cannot seed demo organization: Administrator user '${adminEmail}' not found.`);
    return;
  }

  // 2. Create the default demo organization
  const demoSlug = 'demo-agency';
  const existingOrg = await prisma.organization.findUnique({
    where: { slug: demoSlug },
  });

  if (!existingOrg) {
    await prisma.organization.create({
      data: {
        name: 'Demo Agency Corp',
        slug: demoSlug,
        status: 'ACTIVE',
        ownerUserId: admin.id,
      },
    });
    console.log(`Created default demo organization: ${demoSlug} (owned by ${adminEmail})`);
  } else {
    console.log(`Demo organization already exists: ${demoSlug}`);
  }
}
