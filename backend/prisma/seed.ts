import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: "mysql",
  port: 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const prisma = new PrismaClient({ adapter });
await prisma.$connect();

if ((await prisma.event.findMany()).length === 0) {
  await prisma.event.createMany({
    data: [
      { name: "Kurs programowania w pythonie" },
      { name: "Podstawy Dockera + Kubernetes" },
      { name: "Pisanie aplikacji w React" },
    ],
    skipDuplicates: true,
  });
}

await prisma.$disconnect();
