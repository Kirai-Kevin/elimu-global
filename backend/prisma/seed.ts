import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // First, try to find an existing test user
  const existingUser = await prisma.user.findFirst({
    where: {
      email: 'test@example.com'
    }
  });

  if (existingUser) {
    console.log('Using existing test user:', existingUser);
    return existingUser;
  }

  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test Instructor',
      role: 'instructor',
    },
  });

  console.log('Created new test user:', user);
  return user;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
