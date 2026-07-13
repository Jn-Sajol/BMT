// Identity Domain Database Seeding script

export async function seedIdentity(prisma: any) {
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
  } else {
    console.log(`Administrator user already exists: ${adminEmail}`);
  }
}
