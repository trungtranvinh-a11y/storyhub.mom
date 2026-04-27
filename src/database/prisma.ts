import { PrismaPg } from "@prisma/adapter-pg";

import { databaseUrl } from "@/lib/env";
import { PrismaClient } from "../generated/prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL environment variable.");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

export const prisma =
  globalThis.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
