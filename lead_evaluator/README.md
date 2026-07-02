# DigReddit Lead Evaluator

## What It Is

The lead evaluator is a Cloudflare Worker that performs semantic qualification after the server has found a keyword match. It scores Reddit posts/comments against product-specific criteria using a Llama-compatible API and writes qualified leads into Postgres.

## How To Use

Install dependencies and run the Worker locally with Wrangler:

```bash
npm install
npm run dev
```

Deploy with `npm run deploy` after configuring Cloudflare secrets and the Hyperdrive binding.

## How It Is Built

The Worker exposes a single authenticated `POST` endpoint. It validates the request, loads matching products through Cloudflare Hyperdrive/Postgres, sends the content and criteria to the Llama model, and inserts rows into either `PostLeads` or `CommentLeads` when the score is high enough.

## Architecture

### Request Contract

The server calls the Worker with:

```json
{
  "keywords": ["keyword"],
  "post": null,
  "comment": {
    "id": "comment-id",
    "subreddit": "r/example",
    "author": "username",
    "body": "comment text",
    "createdAt": "timestamp",
    "ups": 10,
    "downs": 0,
    "url": "https://reddit.com/..."
  },
  "isPost": false
}
```

The `Authorization` header must equal `SECURITY_KEY`.

### Product Lookup

`getProducts()` queries the `Products` table for rows whose `keywords` JSON array contains any keyword from the request. Each matching product contributes an ID, description, and criteria block to the model prompt.

### Semantic Scoring

`calculateSimilarity()` builds a prompt for `Llama-4-Scout-17B-16E-Instruct-FP8` through the OpenAI-compatible Llama API. The model is instructed to return JSON containing product IDs, scores, and per-criterion reasoning.

### Lead Writes

`pushPostLeads()` writes qualified post leads into `PostLeads`; `pushCommentLeads()` writes qualified comment leads into `CommentLeads`. Results below score `5` are skipped.

## Environment And Bindings

Use Wrangler/Cloudflare secrets for real values. The checked-in `wrangler.jsonc` intentionally contains blank placeholders.

```bash
SECURITY_KEY=
LLAMA_API_KEY=
GEMINI_API_KEY=
```

Cloudflare Hyperdrive must be bound as `HYPERDRIVE`, and it must point at the same Postgres database used by the dashboard and server.

## Commands

```bash
npm run dev        # Run Wrangler dev server
npm run start      # Alias for Wrangler dev
npm test           # Run Vitest with Cloudflare Workers pool
npm run cf-typegen # Regenerate Worker environment types
npm run deploy     # Deploy to Cloudflare Workers
```

## Security Notes

- The Worker rejects non-`POST` requests.
- The Worker rejects requests whose `Authorization` header does not match `SECURITY_KEY`.
- API keys should be set with Wrangler secrets or Cloudflare dashboard secrets, not committed to `wrangler.jsonc`.
- The Worker writes directly to the lead tables, so restrict who can call it and rotate `SECURITY_KEY` if it is exposed.

## Operational Notes

- The Worker assumes the database schema already exists.
- `criteriaResults` are stored with the lead so the dashboard can show why a lead received its score.
- If no products match the incoming keywords, the Worker returns `404` and does not call the model.
- If the model returns invalid JSON, `calculateSimilarity()` returns `null` and the request fails with a `500`.
