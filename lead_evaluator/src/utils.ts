import postgres from 'postgres';
import { Comment, Post } from './types';
import { OpenAI } from 'openai';

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
	llamaAPIKey: string
): Promise<SimilarityResponse | null> {
	const productDetails = products.map((product) => `User ID: ${product.id}\nProduct Description: "${product.description}"`).join('\n\n');

	const promptContent = `You are a lead generation assistant for DigReddt.

Your task is to determine how strong of a lead a piece of social media content is for one or more products. A strong lead is someone who is likely to be interested in the product and could become a customer.

You will receive the following input:

Social Media Content: the content of a social media post or comment

Products: an array of product objects, each containing:
	User ID: a unique identifier for the product's owner
	Description: the product or service description

Scoring Instructions:

Evaluate how strong of a lead the Social Media Content is for each product's description. A high score means the lead is highly relevant and actionable. A low score means the lead is not relevant or is unlikely to convert.

Use the following criteria (total: 10.0 max):

 - Topical Relevance (0–3 points)
   - Does the lead discuss topics related to the product domain?

 - Expressed Need or Interest (0–3 points)
   - Does the user express a problem, need, or interest the product could solve?

 - Fit as a Potential Buyer (0–2 points)
   - Does the person seem like a potential customer for this product?

 - Actionability (0–2 points)
   - Could this lead be pursued by a sales or marketing team?

 - Bans:
	- If any of the following are true, return a score of 0.0:
		- The lead is a bot
		- The lead is a spam account
		- The lead is trying to sell something, so there's a price tag in the Social Media Content, there is a link to a product, or there's a package or bundle mentioned in the Social Media Content

Only give high scores when the lead shows both relevance and intent/interest. Do not give high scores just for topical overlap without clear potential.

For the return format, return a json object where they key is the userID and the value is the lead score (as a decimal between 0.0 and 10.0).
Example:
\`\`\`json
{
  "72ae8269-d89a-4dbb-8fae-8c54bb438f82": 10.0,
  "8cf6a701-3570-4a77-a43b-c8823eaed1c5": 7.0
  \`\`\`
}
  
Only return the JSON object. Do not add any explanation or commentary.

Product Details:
${productDetails}

Social Media Content:
${bodyText}
`;

	try {
		const openai = new OpenAI({
			apiKey: llamaAPIKey,
			baseURL: 'https://api.llama.com/compat/v1/',
		});

		const completion = await openai.chat.completions.create({
			model: 'Llama-4-Scout-17B-16E-Instruct-FP8',
			messages: [{ content: promptContent, role: 'user' }],
		});

		console.log('Completion: ', completion.choices[0].message.content);

		if (completion.choices[0].message.content) {
			const result = JSON.parse(completion.choices[0].message.content.toString().replace(/```json\n|```/g, ''));
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

			// Make sure to multiply by 1000 to convert from seconds to milliseconds
			const date = new Date(Number(post.createdAt) * 1000);
			const dateString = date.toISOString();

			const lead = await db`
				INSERT INTO "PostLeads" (id, subreddit, title, author, body, url, "numComments", "subredditSubscribers", "over18", ups, downs, "productID", rating, "createdAt")
				VALUES (${post.id}, ${post.subreddit}, ${post.title}, ${post.author}, ${post.body}, ${post.url}, ${post.numComments}, ${post.subredditSubscribers}, ${post.over18}, ${post.ups}, ${post.downs}, ${productID}, ${similarityScore}, ${dateString})
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

			// Make sure to multiply by 1000 to convert from seconds to milliseconds
			const date = new Date(Number(comment.createdAt) * 1000);
			const dateString = date.toISOString();

			const lead = await db`
				INSERT INTO "CommentLeads" (id, subreddit, author, body, url, ups, downs, "productID", rating, "createdAt")
				VALUES (${comment.id}, ${comment.subreddit}, ${comment.author}, ${comment.body}, ${comment.url}, ${comment.ups}, ${comment.downs}, ${productID}, ${similarityScore}, ${dateString})
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
