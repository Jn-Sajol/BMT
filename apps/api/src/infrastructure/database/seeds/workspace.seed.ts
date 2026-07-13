// Workspace Domain Database Seeding script

export async function seedWorkspace(prisma: any) {
  console.log('Seeding Workspace domain...');

  // 1. Fetch the default demo organization
  const demoOrgSlug = 'demo-agency';
  const org = await prisma.organization.findUnique({
    where: { slug: demoOrgSlug },
  });

  if (!org) {
    console.warn(`Cannot seed workspaces: Demo organization '${demoOrgSlug}' not found.`);
    return;
  }

  // Fetch the default admin user to bind as workspace member
  const adminEmail = 'admin@jnsmarketing.local';
  const admin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!admin) {
    console.warn(`Cannot seed workspace memberships: Admin user '${adminEmail}' not found.`);
    return;
  }

  // 2. Seed a default SAFE workspace
  const safeSlug = 'safe-campaigns';
  const existingSafe = await prisma.workspace.findUnique({
    where: {
      organizationId_slug: {
        organizationId: org.id,
        slug: safeSlug,
      },
    },
  });

  let safeWorkspace;
  if (!existingSafe) {
    safeWorkspace = await prisma.workspace.create({
      data: {
        organizationId: org.id,
        name: 'Official API Safe Campaigns',
        slug: safeSlug,
        description: 'Workspace for official API connections and analytics',
        workspaceType: 'SAFE',
        visibility: 'ORGANIZATION',
        status: 'ACTIVE',
      },
    });

    // Default settings
    await prisma.workspaceSettings.create({
      data: {
        workspaceId: safeWorkspace.id,
        timezone: 'UTC',
        language: 'en',
        theme: 'dark',
      },
    });

    // Default preferences
    await prisma.workspacePreferences.create({
      data: {
        workspaceId: safeWorkspace.id,
        preferences: {},
      },
    });

    console.log(`Created default SAFE workspace: ${safeSlug}`);
  } else {
    safeWorkspace = existingSafe;
    console.log(`SAFE workspace already exists: ${safeSlug}`);
  }

  // 3. Seed a default ADVANCED workspace
  const advSlug = 'advanced-growth';
  const existingAdv = await prisma.workspace.findUnique({
    where: {
      organizationId_slug: {
        organizationId: org.id,
        slug: advSlug,
      },
    },
  });

  let advWorkspace;
  if (!existingAdv) {
    advWorkspace = await prisma.workspace.create({
      data: {
        organizationId: org.id,
        name: 'Stealth Browser Advanced Growth',
        slug: advSlug,
        description: 'Workspace for stealth scraping and automated growth hacks',
        workspaceType: 'ADVANCED',
        visibility: 'PRIVATE',
        status: 'ACTIVE',
      },
    });

    // Default settings
    await prisma.workspaceSettings.create({
      data: {
        workspaceId: advWorkspace.id,
        timezone: 'UTC',
        language: 'en',
        theme: 'dark',
      },
    });

    // Default preferences
    await prisma.workspacePreferences.create({
      data: {
        workspaceId: advWorkspace.id,
        preferences: {},
      },
    });

    console.log(`Created default ADVANCED workspace: ${advSlug}`);
  } else {
    advWorkspace = existingAdv;
    console.log(`ADVANCED workspace already exists: ${advSlug}`);
  }

  // 4. Bind admin as a member of both workspaces
  const existingSafeMember = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: safeWorkspace.id,
        userId: admin.id,
      },
    },
  });

  if (!existingSafeMember) {
    await prisma.workspaceMember.create({
      data: {
        workspaceId: safeWorkspace.id,
        userId: admin.id,
      },
    });
    console.log(`Added admin as member of SAFE workspace.`);
  }

  const existingAdvMember = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: advWorkspace.id,
        userId: admin.id,
      },
    },
  });

  if (!existingAdvMember) {
    await prisma.workspaceMember.create({
      data: {
        workspaceId: advWorkspace.id,
        userId: admin.id,
      },
    });
    console.log(`Added admin as member of ADVANCED workspace.`);
  }
}
