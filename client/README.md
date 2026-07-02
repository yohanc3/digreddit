# DigReddit Client

## What It Is

The client is the DigReddit web dashboard. It lets authenticated users create products, define keywords and lead criteria, review Reddit leads, filter the lead queue, and organize work with bookmarks and collections.

## How To Use

Install dependencies and start the Next.js dev server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, then sign in and create a product before expecting leads to appear.

## How It Is Built

The client is a Next.js 14 app-router application with React, Tailwind CSS, Radix UI primitives, TanStack Query, NextAuth, and Drizzle ORM. It talks directly to Postgres through server-side database helpers and exposes lightweight app routes for product creation and lead retrieval.

## Architecture

### App Shell

- `src/app/layout.tsx` defines the global app shell and providers.
- `src/app/page.tsx` is the public landing/sign-in entry point.
- `src/app/dashboard/page.tsx` is the main lead review surface.
- `src/app/create-product/page.tsx` and `src/app/your-products/page.tsx` manage product setup.
- `src/app/bookmarks/page.tsx` and `src/app/collections/page.tsx` support saved lead workflows.

### Authentication

Authentication is configured in `auth.ts` with NextAuth, Google OAuth, and the Drizzle adapter. The sign-in callback currently gates access through a beta-user email list in `src/lib/backend/constant/betaUsers.ts`.

### Data Access

The database schema lives in `src/db/schema.ts`, and query helpers live in `src/db/index.ts`. Drizzle is used for typed Postgres access, with core entities including `Products`, `PostLeads`, `CommentLeads`, `Bookmarks`, `Collections`, `Users`, and auth tables.

### API Routes

- `POST /api/products` creates a product for the authenticated user.
- `GET /api/products` returns the authenticated user's products.
- `POST /api/leads` returns paginated and filtered leads for a product.
- `/api/product/*` routes update/delete products, generate/update criteria, and manage product bookmarks/collections.
- `/api/leads/*` routes update stages, delete leads, bookmark leads, and generate outreach responses.
- `/api/reddit/*` routes handle Reddit OAuth, user lookup, and comment actions.
- `/api/feedback/create`, `/api/beta-users/create`, and `/api/user/collections` support feedback, waitlist/beta capture, and user collection lookup.

The server-side API routes mostly wrap `productsQueries` and `leadsQueries` from `src/db/index.ts`.

### Frontend State

The frontend uses TanStack Query and custom hooks under `src/lib/frontend/hooks/` to fetch products, leads, bookmarks, collections, Reddit connection state, and user data. Shared UI components live under `src/lib/components/`.

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

Drizzle config is in `drizzle.config.ts`, and generated migrations live under `drizzle/`. The dashboard reads and writes the same Postgres database used by the scraper/server and Cloudflare Worker, so product keywords created here directly drive the backend matching pipeline.

## Operational Notes

- Create at least one product with keywords before running the scraper pipeline.
- Lead filters are applied across both post and comment lead tables.
- The dashboard expects qualified leads to already exist in Postgres; it does not scrape Reddit itself.
- Keep `.env` local and use deployment-provider secret storage for production.
