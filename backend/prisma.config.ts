import type { PrismaConfig } from "prisma";

const DATABASE_URL = process.env.DATABASE_URL ?? "";

export default {
  datasource: {
    url: DATABASE_URL,
  },
} satisfies PrismaConfig;
