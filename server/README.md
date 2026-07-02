# DigReddit Server

## What It Is

The server is the Reddit intake and keyword-filtering layer. It runs an AdonisJS API for receiving content batches and includes a Node.js scraper worker that polls Reddit posts or comments.

## How To Use

Install dependencies, start the Adonis server, then run the scraper worker with Reddit environment variables configured:

```bash
npm install
npm run dev
node scraper_worker/scraper.js
```

Set `REDDIT_WORKER_THING_TYPE=posts` or `REDDIT_WORKER_THING_TYPE=comments` depending on which Reddit stream this worker should follow.

## How It Is Built

The server is an AdonisJS 6 app backed by Postgres through Lucid and a dynamic Aho-Corasick matcher. The scraper polls Reddit in ID batches, sanitizes API responses, posts them to `/webhook/intake`, and the Adonis controller forwards keyword-matched content to the Cloudflare lead evaluator.

## Architecture

### HTTP API

- `POST /webhook/intake` receives sanitized post/comment batches from the scraper.
- `GET /` returns product keywords from the database and is mainly useful as a quick connectivity check.

The intake controller validates payload shape, runs keyword matching, and forwards only matched content to `LEAD_EVALUATOR_URL`.

### Keyword Matching

`app/services/AhoCorasick.ts` builds an in-memory matcher from `Products.keywords`. It refreshes the matcher every five minutes by adding new database keywords and removing keywords that no longer belong to any product.

This keeps the expensive semantic scoring stage behind a cheap lexical filter.

### Reddit Scraper Worker

The scraper entry point is `scraper_worker/scraper.js`. It:

- obtains a Reddit OAuth token,
- finds an initial post/comment ID,
- builds batches of up to 100 sequential Reddit IDs,
- fetches the batch with `/api/info.json`,
- sanitizes Reddit payloads into the internal post/comment shape,
- sends the batch to the local Adonis intake endpoint,
- logs throughput and latency.

The worker can operate in either post mode or comment mode using `REDDIT_WORKER_THING_TYPE`.

### Lead Evaluator Handoff

For each keyword match, the server sends this shape to the Cloudflare Worker:

```json
{
  "post": {},
  "comment": null,
  "isPost": true,
  "keywords": ["example keyword"]
}
```

The request includes `Authorization: LEAD_EVALUATOR_AUTH_KEY`, which must match the Worker's `SECURITY_KEY`.

## Environment Variables

Keep the real `.env` file local. The Adonis app and scraper expect values like:

```bash
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=
NODE_ENV=development
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

`REDDIT_API_KEY` is populated/refreshed by the OAuth helper at runtime, but it still exists in the process environment while the scraper is running.

## Commands

```bash
npm run dev        # Start Adonis with HMR
npm run start      # Start compiled server entry
npm run build      # Build Adonis app
npm run test       # Run Japa tests
npm run lint       # Run ESLint
npm run format     # Format with Prettier
npm run typecheck  # Run TypeScript without emit
```

## Local Pipeline Checklist

1. Start Postgres and make sure `DB_CONNECTION_URL` points at the DigReddit database.
2. Start `lead_evaluator` locally or deploy it and set `LEAD_EVALUATOR_URL`.
3. Start the Adonis server with `npm run dev`.
4. Run `node scraper_worker/scraper.js` with `REDDIT_WORKER_THING_TYPE=posts`.
5. Run a second scraper process with `REDDIT_WORKER_THING_TYPE=comments` if comment monitoring is needed.

## Operational Notes

- The scraper sends batches to `http://localhost:${PORT}/webhook/intake`, so the Adonis server must be running locally for the worker process.
- Reddit rate limiting is handled by delaying when a `429` response is returned.
- The keyword matcher is populated from the `Products` table, so an empty product table means no content will be forwarded to the Worker.
- Do not commit `.env`, build artifacts containing env files, or generated secret-bearing config.
