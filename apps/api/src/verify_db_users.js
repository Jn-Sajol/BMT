const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log("Checking DB Users...");
  const users = await prisma.user.findMany();
  console.log("Existing Users in DB:", users.map(u => ({ id: u.id, email: u.email })));

  const email = "julkar10121@gmail.com";
  const rawPassword = "Password123";
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  const existingUser = users.find(u => u.email === email);

  if (!existingUser) {
    console.log(`Creating user ${email}...`);
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: "Julkar",
        lastName: "Nayeem",
        emailVerifiedAt: new Date(),
      }
    });
    console.log("User created successfully:", newUser.id);
  } else {
    console.log(`Updating password for user ${email}...`);
    await prisma.user.update({
      where: { email },
      data: {
        passwordHash,
        emailVerifiedAt: new Date(),
      }
    });
    console.log("User password updated successfully!");
  }
}

main().catch(err => console.error("Error:", err)).finally(() => prisma.$disconnect());
