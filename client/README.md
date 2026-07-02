# DigReddit Client

## What It Is

The client is the DigReddit web dashboard. It lets authenticated users create products, define keywords and lead criteria, review Reddit leads, and organize work with bookmarks and collections.

## How To Use

Install dependencies and start the Next.js dev server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, then sign in and create a product before expecting leads to appear.

## How It Is Built

The client is a Next.js 14 app-router application with React, Tailwind CSS, Radix UI primitives, TanStack Query, NextAuth, and Drizzle ORM. It stores and reads data from Postgres through typed helpers, and exposes app routes for product, lead, Reddit, and feedback workflows.

## Architecture

- `src/app/layout.tsx` and `src/app/page.tsx` define the shell and sign-in entry point.
- `src/app/dashboard/page.tsx`, `src/app/create-product/page.tsx`, `src/app/your-products/page.tsx`, `src/app/bookmarks/page.tsx`, and `src/app/collections/page.tsx` cover the main user flows.
- `auth.ts` configures NextAuth with Google OAuth and a beta-user gate.
- `src/db/schema.ts` and `src/db/index.ts` define the schema and typed queries for products, leads, collections, bookmarks, and auth tables.
- `src/lib/frontend/hooks/` and `src/lib/components/` hold the reusable query hooks and UI pieces.

## Environment Variables

Do not commit real values. A local `.env` should include the Postgres URL and auth/provider secrets used by NextAuth.

```bash
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_REDDIT_CLIENT_ID=
REDDIT_SECRET=
```

Optional analytics and AI variables may be needed for routes or helpers that use PostHog or model providers:

```bash
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
AI_API_KEY=
AI_BASE_URL=
GEMINI_API_KEY=
LLAMA_API_KEY=
```

## Commands

```bash
npm run dev          # Start local development server
npm run build        # Build production Next.js app
npm run start        # Serve the production build
npm run check-types  # Run TypeScript without emit
npm run lint         # Type-check and run Next lint
```

## Database

Drizzle config is in `drizzle.config.ts`, and generated migrations live under `drizzle/`. The dashboard shares the same Postgres database as the scraper/server and Cloudflare Worker, so product keywords created here drive the backend matching pipeline.

## Operational Notes

- Create at least one product with keywords before running the scraper pipeline.
- The dashboard itself does not scrape Reddit.
- Keep `.env` local and use deployment-provider secret storage for production.
