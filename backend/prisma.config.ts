import type { PrismaConfig } from "prisma";

const DATABASE_URL = process.env.DATABASE_URL ?? "";

export default {
  datasource: {
    url: DATABASE_URL,
  },
  migrations: {
    seed: "bun prisma/seed.ts",
  },
} satisfies PrismaConfig;
