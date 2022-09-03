import { PrismaClient, Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    username: "user",
    email: "user@mail.com",
    password: hashSync("password@", 10),
  },
  {
    username: "user1",
    email: "user1@mail.com",
    password: hashSync("password@", 10),
  },
  {
    username: "user3",
    email: "user3@mail.com",
    password: hashSync("password@", 10),
  },
  {
    username: "user4",
    email: "user4@mail.com",
    password: hashSync("password@", 10),
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
