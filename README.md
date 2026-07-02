## What It Is

DigReddit turns Reddit posts and comments into ranked product leads. Users define products, keywords, and lead criteria in the dashboard, then the backend filters content, scores likely matches, and stores qualified leads in Postgres.

## Architecture Diagram

![DigReddit Architecture](docs/digreddit-architecture.png)

The diagram reads like a left-to-right pipeline with one shared database in the middle.

## How To Use

Run each asset from its own directory with npm:

```bash
cd client && npm install && npm run dev
cd server && npm install && npm run dev
cd lead_evaluator && npm install && npm run dev
```

For the local pipeline, start the Adonis server first, run the Cloudflare Worker with Wrangler, then run the Reddit scraper worker from `server/scraper_worker/scraper.js` with the required Reddit and lead-evaluator environment variables configured.

## How It Is Built

DigReddit is a three-part system around a shared Postgres database: the Next.js app owns the dashboard, the AdonisJS service owns Reddit ingestion and keyword matching, and the Cloudflare Worker owns semantic scoring and lead writes.

## How The Pieces Tie Together

1. A user creates a product in the dashboard.
2. Product keywords land in Postgres and feed the Aho-Corasick matcher.
3. The scraper batches Reddit posts/comments into the Adonis intake endpoint.
4. The intake layer forwards keyword matches to the Cloudflare Worker.
5. The Worker scores the content with the Llama API and writes qualified leads back to Postgres.
6. The dashboard reads `PostLeads` and `CommentLeads` for review and follow-up.

## Environment Variables

Do not commit real `.env` files. Configure secrets locally or through deployment platforms.

### Client

The dashboard expects a Postgres connection string and auth/provider secrets required by NextAuth and Google OAuth.

```bash
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_REDDIT_CLIENT_ID=
REDDIT_SECRET=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

### Server

The server expects Adonis runtime settings, the database URL, Reddit OAuth credentials, and the lead evaluator endpoint/auth key.

```bash
PORT=3333
HOST=localhost
NODE_ENV=development
APP_KEY=
LOG_LEVEL=info
DB_CONNECTION_URL=
LEAD_EVALUATOR_URL=
LEAD_EVALUATOR_AUTH_KEY=
REDDIT_USERNAME=
REDDIT_PASSWORD=
REDDIT_CLIENTID=
REDDIT_CLIENT_SECRET=
REDDIT_API_KEY=
REDDIT_WORKER_THING_TYPE=posts
```

`REDDIT_WORKER_THING_TYPE` controls whether the scraper follows posts or comments.

### Lead Evaluator

The Worker expects secrets/bindings in Wrangler or the Cloudflare dashboard.

```bash
SECURITY_KEY=
LLAMA_API_KEY=
GEMINI_API_KEY=
HYPERDRIVE=Cloudflare Hyperdrive binding
```

`GEMINI_API_KEY` remains in the config surface, but the current scoring path uses the Llama-compatible OpenAI client.
