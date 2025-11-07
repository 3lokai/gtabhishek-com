import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Load .env.local for Next.js compatibility
config({ path: ".env.local" });
config(); // Also load .env if it exists

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
    directUrl: env("DIRECT_URL"),
  },
});
