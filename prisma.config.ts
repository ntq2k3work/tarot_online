import "dotenv/config";
import { defineConfig } from "prisma/config";

// Build DATABASE_URL from individual env vars or use DATABASE_URL directly
function getDatabaseUrl(): string {
  if (process.env["DATABASE_URL"]) {
    return process.env["DATABASE_URL"];
  }

  const host = process.env["DB_HOST"] || "localhost";
  const port = process.env["DB_PORT"] || "5432";
  const name = process.env["DB_NAME"] || "tarot_online";
  const user = process.env["DB_USER"] || "postgres";
  const password = process.env["DB_PASSWORD"] || "postgres";

  return `postgresql://${user}:${password}@${host}:${port}/${name}?schema=public`;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
