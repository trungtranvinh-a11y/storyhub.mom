import "dotenv/config";

import { inspect } from "node:util";
import { Client } from "pg";

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name} environment variable.`);
  }

  return value;
}

function getDatabaseName(databaseUrl: string) {
  const parsed = new URL(databaseUrl);
  const pathname = parsed.pathname.replace(/^\//, "");

  if (!pathname) {
    throw new Error("DATABASE_URL must include a database name.");
  }

  return pathname;
}

function buildAdminConnectionString(databaseUrl: string) {
  const explicitAdminUrl = process.env.DATABASE_ADMIN_URL;

  if (explicitAdminUrl) {
    return explicitAdminUrl;
  }

  const parsed = new URL(databaseUrl);
  parsed.pathname = "/postgres";
  return parsed.toString();
}

function quoteIdentifier(value: string) {
  return `"${value.replace(/"/g, "\"\"")}"`;
}

async function main() {
  const databaseUrl = requireEnv("DATABASE_URL");
  const targetDatabaseName = getDatabaseName(databaseUrl);
  const adminConnectionString = buildAdminConnectionString(databaseUrl);

  const client = new Client({
    connectionString: adminConnectionString,
  });

  try {
    await client.connect();

    const result = await client.query<{ exists: boolean }>(
      "SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1) AS exists",
      [targetDatabaseName],
    );

    if (result.rows[0]?.exists) {
      console.log(`Database "${targetDatabaseName}" already exists.`);
      return;
    }

    await client.query(
      `CREATE DATABASE ${quoteIdentifier(targetDatabaseName)} WITH ENCODING 'UTF8' TEMPLATE template0`,
    );
    console.log(`Database "${targetDatabaseName}" created successfully.`);
  } catch (error) {
    if (error instanceof Error) {
      const detail = error.message || inspect(error);
      throw new Error(
        `Unable to ensure PostgreSQL database "${targetDatabaseName}". Make sure PostgreSQL is running and the credentials in DATABASE_URL or DATABASE_ADMIN_URL are valid. Original error: ${detail}`,
      );
    }

    throw new Error(
      `Unable to ensure PostgreSQL database "${targetDatabaseName}". Unexpected error: ${inspect(error)}`,
    );
  } finally {
    await client.end().catch(() => undefined);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Unknown database bootstrap error.");
  process.exit(1);
});
