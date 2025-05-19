/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { calculateSimilarity, pushCommentLeads, pushPostLeads, PushLeadsReturn, SimilarityResponse } from './utils';

import { Post, Comment } from './types';
import postgres from 'postgres';
import { getProducts, ProductInput } from './utils';

export interface Env {
	SECURITY_KEY: string;
	DEEPSEEK_API_KEY: string;
	HYPERDRIVE: Hyperdrive;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method !== 'POST') {
			return new Response(JSON.stringify({ error: 'Not allowed.' }), { status: 405 });
		}

		// Security key check
		const headers = request.headers;
		const key = headers.get('Authorization');
		if (key !== env.SECURITY_KEY) {
			return new Response(JSON.stringify({ error: 'Unauthorized.' }), { status: 401 });
		}

		let body: {
			keywords: string[];
			post: Post | null;
			comment: Comment | null;
			isPost: boolean;
		} | null = null;

		try {
			body = await request.json();

			if (
				!body ||
				body.isPost === undefined ||
				body.isPost === null ||
				(body.isPost && !body.post) ||
				(!body.isPost && !body.comment) ||
				!body.keywords ||
				body.keywords.length === 0
			) {
				throw new Error('Invalid request body.');
			}
		} catch (error) {
			return new Response(JSON.stringify({ error: 'Invalid request body.' }), { status: 400 });
		}

		// A content entry is either a post or a comment
		const contentEntry = body.isPost ? body.post : body.comment;

		let db: postgres.Sql | null;

		try {
			db = postgres(env.HYPERDRIVE.connectionString, { max: 10 });

			if (db === null) {
				throw new Error('Failed to connect to database.');
			}
		} catch (error) {
			console.error(`Error while connecting to database: ${error}`);
			return new Response(JSON.stringify({ error: 'Failed to connect to database.' }), { status: 500 });
		}

		const keywords = body.keywords;

		const products: ProductInput[] | null = await getProducts(keywords, db);

		console.log(`Products: ${JSON.stringify(products, null, 2)}`);

		if (products === null) {
			console.error(`Error while getting products`);
			return new Response(JSON.stringify({ error: 'Failed to get products.' }), { status: 500 });
		}

		if (products.length === 0) {
			return new Response(JSON.stringify({ error: `No products found for keywords: ${keywords.join(', ')}` }), { status: 404 });
		}

		console.log(`Products: ${JSON.stringify(products, null, 2)}`);

		const similarity: SimilarityResponse | null = await calculateSimilarity(contentEntry!.body, products, env.DEEPSEEK_API_KEY);

		if (similarity === null) {
			return new Response(JSON.stringify({ error: 'Failed to calculate similarity.' }), { status: 500 });
		}

		let pushLeadsReturn: PushLeadsReturn;

		if (body.isPost) {
			pushLeadsReturn = await pushPostLeads(similarity, db, body.post!);
		} else {
			pushLeadsReturn = await pushCommentLeads(similarity, db, body.comment!);
		}

		if (pushLeadsReturn.message === 'all') {
			return new Response(JSON.stringify({ message: 'Successfully pushed all leads.' }), { status: 200 });
		} else if (pushLeadsReturn.message === 'some') {
			return new Response(JSON.stringify({ message: 'Failed to push (some) leads.' }), { status: 500 });
		}

		return new Response(JSON.stringify({ error: 'Failed to push leads.' }), { status: 500 });
	},
} satisfies ExportedHandler<Env>;
