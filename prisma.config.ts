import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Local dev keeps secrets in .env.local; in production DATABASE_URL comes from the host's environment.
config({ path: ".env.local", quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env.DATABASE_URL },
});
