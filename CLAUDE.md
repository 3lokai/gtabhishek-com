# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Next.js 16 (App Router, Turbopack) + React 19 + TypeScript, Tailwind CSS v4, shadcn/ui (Radix), Supabase (auth + Postgres via `@supabase/ssr`), Prisma (Postgres on the same Supabase DB), TanStack Query, Velite (markdown content), Resend (transactional email), Biome + Ultracite for lint/format. Node 20.11.0 (pinned in `.nvmrc`).

## Commands

```bash
npm run dev              # parallel: velite --watch + next dev --turbopack
npm run build            # serial: build:content (velite --clean) then build:next
npm run start            # next start
npm run type-check       # tsc --noEmit
npm run check            # ultracite check  (lint)
npm run format           # ultracite format
npm run fix              # ultracite fix    (autofix lint+format)
npm run supabase:types   # regenerates src/types/supabase.ts (do not hand-edit)
npm run velite           # one-shot content build
```

There is no test runner configured. Pre-commit (Husky + lint-staged) runs `biome check --write` and `biome format --write` on staged JS/TS.

Prisma:

```bash
npx prisma migrate dev --name <name>
npx prisma generate
```

## Architecture

**App Router layout** — `src/app/`. Top-level providers are stacked in `src/app/layout.tsx` in this order: `ThemeProvider` → `QueryProvider` → `ModalProvider` → `Toaster`. Anything that needs theming/query/modal context must live inside this tree. There is no `AuthProvider` wired in despite README claims — auth state is consumed via hooks/Supabase clients directly.

**Velite content pipeline** — Markdown blog posts live in `content/blog/*.md` and are compiled by Velite (`velite.config.ts`) into a typed `BlogPost` collection with a `permalink` of `/blog/{slug}`. `next.config.ts` kicks off `velite.build()` on `next dev`/`next build` via the `VELITE_STARTED` env guard, so you generally don't need to run velite manually. Schema changes go in `velite.config.ts`.

**Supabase access** — `src/lib/supabase/` exposes separate browser (`client.ts`) and server (`server.ts`) clients built on `@supabase/ssr`. Always pick the one matching the runtime; do not import the browser client from server components or route handlers. This project uses the new **publishable** key (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`), not the legacy `anon` key.

**Prisma vs Supabase** — Both talk to the same Supabase Postgres. Prisma (`src/lib/prisma.ts`, schema in `prisma/schema.prisma`) is used for server-side writes from server actions (e.g. contact form persistence). Supabase JS is used for auth + client-readable data subject to RLS. `DATABASE_URL` is the pooled connection; `DIRECT_URL` is for migrations.

**Routing edge layer** — `src/proxy.ts` exports a `proxy` function and a `config.matcher`. This is the Next middleware entry (the file is named `proxy.ts` rather than `middleware.ts` — do not assume a `middleware.ts` exists). It currently passes requests through unchanged; auth gating logic would go here.

**Env validation** — `env.ts` parses `process.env` with Zod at import time. Add new variables to the schema there before using them; missing required vars will throw on startup. Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `DATABASE_URL`, `RESEND_API_KEY`, `CONTACT_EMAIL`.

**Contact form** — `src/app/contact/actions.ts` is a server action that (1) persists to Prisma `ContactMessage`, (2) sends two Resend emails (notification + user confirmation), (3) optionally posts to `SLACK_WEBHOOK_URL`. Honeypot field is named `website`. The Resend `from` address is hardcoded — update it when changing domains.

**Data fetching pattern** — TanStack Query is the canonical client-side data layer. Reusable query helpers live in `src/hooks/` (`use-supabase-query.ts`, `use-user.ts`); query keys are centralized in `src/lib/query-keys.ts`. Prefer adding to these over ad-hoc `useQuery` calls.

## Conventions

- **Lint/format is enforced by Ultracite + Biome**, configured in `biome.json`. The full ruleset is documented in `.rules` and `.cursor/rules/ultracite.mdc` — read these before fighting the linter; many rules (no `forEach`, no positive `tabIndex`, no `arguments`, arrow functions over function expressions, accessibility constraints) are non-negotiable here.
- shadcn/ui components are added via `npx shadcn@latest add <name>` and land in `src/components/ui/`. The config is in `components.json`.
- Path alias `@/*` → `src/*` (see `tsconfig.json`).
- Generated files — `src/types/supabase.ts` (regenerate via `npm run supabase:types`) and `.velite/` (regenerated on dev/build). Do not edit by hand.
