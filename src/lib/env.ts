const fallbackAuthSecret =
  process.env.NODE_ENV === "development" ? "dev-only-secret-change-me" : undefined;

export const authSecret =
  process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? fallbackAuthSecret;

export const databaseUrl = process.env.DATABASE_URL;

if (!authSecret) {
  throw new Error("Missing AUTH_SECRET or NEXTAUTH_SECRET environment variable.");
}
