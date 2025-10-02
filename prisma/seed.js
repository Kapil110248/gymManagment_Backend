import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { name: "Kapil", email: "kapil@example.com", age: 25 },
      { name: "Ravi", email: "ravi@example.com", age: 30 }
    ],
    skipDuplicates: true
  });

  console.log("✅ User seed data inserted successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
