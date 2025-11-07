import { z } from "zod";

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.url("Invalid Supabase URL"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "Supabase publishable key is required"),

  // Optional Supabase secret key (server-side only)
  SUPABASE_SECRET_KEY: z.string().optional(),

  // Database (Supabase PostgreSQL connection string)
  // Get this from: Supabase Dashboard → Settings → Database → Connection string → URI
  DATABASE_URL: z.string().url("Invalid database URL"),
  // Direct connection URL (for migrations and direct queries)
  DIRECT_URL: z.string().url("Invalid direct database URL").optional(),

  // App configuration
  NEXT_PUBLIC_APP_NAME: z.string().default("Next.js Starter"),
  NEXT_PUBLIC_APP_URL: z.string().min(1).url().optional(),

  // Contact form
  RESEND_API_KEY: z.string().min(1, "Resend API key is required"),
  CONTACT_EMAIL: z.string().email("Invalid contact email"),
  SLACK_WEBHOOK_URL: z.string().url("Invalid Slack webhook URL").optional(),

  // Node environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
