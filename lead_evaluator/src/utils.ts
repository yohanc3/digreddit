import OpenAI from 'openai';
import postgres from 'postgres';
import { Comment, Post } from './types';

export interface ProductInput {
	id: string;
	description: string;
}

export interface SimilarityResponse {
	[userId: string]: number;
}

export async function calculateSimilarity(
	bodyText: string,
	products: ProductInput[],
	openaiKey: string
): Promise<SimilarityResponse | null> {
	const openai = new OpenAI({
		baseURL: 'https://api.deepseek.com',
		apiKey: openaiKey,
	});

	const productDetails = products.map((product) => `User ID: ${product.id}\nProduct Description: "${product.description}"`).join('\n\n');

	const promptContent = `You are an expert lead generation assistant for DigReddt. Your goal is to find relevant leads for businesses by comparing social media content (posts/comments) to their product/service descriptions.

Given the following social media content:
'''
${bodyText}
'''

And the following product/service descriptions:
${productDetails}

Please evaluate how similar the social media content is to *each* product description. Rate the similarity as a decimal number between 0.0 (not at all similar or relevant as a lead) and 10.0 (highly similar and a strong potential lead).

Return your response *only* as a single JSON object. Each key in the JSON object must be the ID, and its corresponding value must be the similarity score (a decimal number). Do not include any other text, explanations, or formatting outside of this JSON object.

Example response format:
{
  "id_1": 7.5,
  "id_abc": 9.2,
  "id_42": 3.0
}`;

	try {
		const completion = await openai.chat.completions.create({
			messages: [
				{ role: 'system', content: 'You are a helpful assistant specialized in JSON outputs.' },
				{ role: 'user', content: promptContent },
			],
			model: 'deepseek-chat',
			response_format: {
				type: 'json_object',
			},
		});

		if (completion.choices[0]?.message?.content) {
			const result = JSON.parse(completion.choices[0].message.content);
			console.log(`Result: ${JSON.stringify(result, null, 2)}`);
			return result as SimilarityResponse;
		}

		console.error('No content in completion response.');
		return null;
	} catch (error) {
		console.error('Error calculating similarity: ', error);
		return null;
	}
}

export async function getProducts(keywords: string[], db: postgres.Sql) {
	try {
		const products: ProductInput[] = await db`
			SELECT title, id, description
			FROM "Products"
			WHERE EXISTS (
				SELECT 1
				FROM jsonb_array_elements_text("Products".keywords) AS product_keyword
				WHERE product_keyword = ANY(${keywords})
			);`;

		return products;
	} catch (error) {
		console.error(`Error while getting products: ${error}`);
		return null;
	}
}

export type PushLeadsReturn = {
	success: boolean;
	message: 'all' | 'some' | 'none';
};

export async function pushPostLeads(similarityResults: SimilarityResponse, db: postgres.Sql, post: Post): Promise<PushLeadsReturn> {
	try {
		const leadIDs: string[] = [];
		const skippedLeads: string[] = [];

		for (const [productID, similarityScore] of Object.entries(similarityResults)) {
			if (similarityScore < 5) {
				console.log(`Skipping lead for product ${productID} with similarity score ${similarityScore} due to low similarity`);
				skippedLeads.push(productID);
				continue;
			}

			const lead = await db`
				INSERT INTO "PostLeads" (subreddit, title, author, body, url, "numComments", "subredditSubscribers", "over18", ups, downs, "productID", rating)
				VALUES (${post.subreddit}, ${post.title}, ${post.author}, ${post.body}, ${post.url}, ${post.numComments}, ${post.subredditSubscribers}, ${post.over18}, ${post.ups}, ${post.downs}, ${productID}, ${similarityScore})
				RETURNING id
			`;

			leadIDs.push(lead[0]?.id || '');
		}

		// Returns true if the length of the leadIDs array is equal to the number of similarityResults
		return {
			success: leadIDs.length === Object.keys(similarityResults).length - skippedLeads.length,
			message:
				leadIDs.length === Object.keys(similarityResults).length - skippedLeads.length ? 'all' : leadIDs.length > 0 ? 'some' : 'none',
		};
	} catch (error) {
		console.error(`Error while pushing leads: ${error}`);
		return {
			success: false,
			message: 'none',
		};
	}
}

export async function pushCommentLeads(
	similarityResults: SimilarityResponse,
	db: postgres.Sql,
	comment: Comment
): Promise<PushLeadsReturn> {
	try {
		const leadIDs: string[] = [];
		const skippedLeads: string[] = [];

		for (const [productID, similarityScore] of Object.entries(similarityResults)) {
			if (similarityScore < 5) {
				console.log(`Skipping lead for product ${productID} with similarity score ${similarityScore} due to low similarity`);
				skippedLeads.push(productID);
				continue;
			}

			const lead = await db`
				INSERT INTO "CommentLeads" (subreddit, author, body, url, ups, downs, "productID", rating)
				VALUES (${comment.subreddit}, ${comment.author}, ${comment.body}, ${comment.url}, ${comment.ups}, ${comment.downs}, ${productID}, ${similarityScore})
				RETURNING id
			`;

			leadIDs.push(lead[0]?.id || '');
		}

		// Returns true if the length of the leadIDs array is equal to the number of similarityResults
		return {
			success: leadIDs.length === Object.keys(similarityResults).length - skippedLeads.length,
			message:
				leadIDs.length === Object.keys(similarityResults).length - skippedLeads.length ? 'all' : leadIDs.length > 0 ? 'some' : 'none',
		};
	} catch (error) {
		console.error(`Error while pushing leads: ${error}`);
		return {
			success: false,
			message: 'none',
		};
	}
}
