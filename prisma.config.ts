import "dotenv/config";

import { defineConfig } from "prisma/config";

const directUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!directUrl) {
  throw new Error("Missing DIRECT_URL or DATABASE_URL for Prisma CLI.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: directUrl,
  },
});
