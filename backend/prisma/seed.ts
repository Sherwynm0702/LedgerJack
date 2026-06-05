import "dotenv/config";
import { PrismaClient } from '../src/generated/prisma/index.js';
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'admin@biztrack.com',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'manager@biztrack.com',
      password: hashedPassword,
    },
  });

  const emp1 = await prisma.employee.create({
    data: {
      name: 'John Doe',
      salary: 50000,
    },
  });

  const emp2 = await prisma.employee.create({
    data: {
      name: 'Jane Smith',
      salary: 60000,
    },
  });

  await prisma.expense.create({
    data: {
      amount: 150.50,
      category: 'Office Supplies',
      userId: user1.id,
    },
  });

  await prisma.expense.create({
    data: {
      amount: 2500.00,
      category: 'Equipment',
      userId: user2.id,
    },
  });

  await prisma.payrollRecord.create({
    data: {
      employeeId: emp1.id,
      amount: 4166.67,
      date: new Date('2026-01-15'),
    },
  });

  await prisma.payrollRecord.create({
    data: {
      employeeId: emp2.id,
      amount: 5000.00,
      date: new Date('2026-01-15'),
    },
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });