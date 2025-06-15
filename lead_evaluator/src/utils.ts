import postgres from 'postgres';
import { Comment, Post } from './types';
import { OpenAI } from 'openai';

export interface ProductInput {
	id: string;
	description: string;
	criteria: string;
}

export interface SimilarityResponse {
	id: string;
	score: number;
	criteriaResults: string[];
}

export async function calculateSimilarity(
	bodyText: string,
	products: ProductInput[],
	llamaAPIKey: string
): Promise<SimilarityResponse[] | null> {
	const productDetails = products
		.map(
			(product) =>
				`Product ID: ${product.id}\nProduct Description: "${product.description}"\nLead Evaluation Criteria: "${
					product.criteria || 'No criteria provided'
				}"`
		)
		.join('\n\n');

	const promptContent = `You are a lead generation assistant for DigReddit.

Your task is to determine how strong of a lead a piece of social media content is for one or more products. A strong lead is someone who is likely to be interested in the product and could become a customer.

You will receive an SERIES of the following input:

1. Social Media Content: the content of a social media post or comment

2. Products: an array of product objects, each containing:
	1. Product ID: a unique identifier for the product
	2. Description: the product or service description
	3. Criteria: the criteria for evaluating the lead for the product

Scoring Instructions:

Use the criteria provided in each Product Details to evaluate the respective Social Media Content. Ensure you are using only the correct criteria for each product, and you are using EVERY single criterion. If there is not criteria for a product, simply return a score of 0.0 for the respective product description. Remember well, you may receive a criteria for one product, and none for another.

For the return format, return a JSON ARRAY of objects where the key is the product ID and the value is the lead score (as a decimal between 0.0 and 10.0). Additionally, add the score the lead received for each criterion and return a brief summary with each criterion, the points awarded, and the reason selected in human-readable format.

Example output:
\`\`\`json
[
  {
	"id": <product ID>,
	"score": 10.0,
	"criteriaResults":
		"1. <criterion name>: <points awarded> – <reason selected>",
		"2. <criterion name>: <points awarded> – <reason selected>",
		"3. <criterion name>: <points awarded> – <reason selected>",
		"4. <criterion name>: <points awarded> – <reason selected>"
  },
  {
	"id": <product ID>,
	"score": 7.0,
	"criteriaResults":
		"1. <criterion name>: <points awarded> – <reason selected>",
		"2. <criterion name>: <points awarded> – <reason selected>",
		"3. <criterion name>: <points awarded> – <reason selected>",
		"4. <criterion name>: <points awarded> – <reason selected>"
  }
]
\`\`\`
  
Only return the JSON object. Do not add any explanation or commentary.

Products Details:
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

		if (completion.choices[0].message.content) {
			const result = JSON.parse(completion.choices[0].message.content.toString().replace(/```json\n|```/g, ''));
			console.log(`Result: ${JSON.stringify(result, null, 2)}`);
			return result as SimilarityResponse[];
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
			SELECT title, id, description, criteria
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

export async function pushPostLeads(similarityResults: SimilarityResponse[], db: postgres.Sql, post: Post): Promise<PushLeadsReturn> {
	try {
		const leadIDs: string[] = [];
		const skippedLeads: string[] = [];

		for (const similarityResult of similarityResults) {
			const productID = similarityResult.id;
			const similarityScore = similarityResult.score;
			const criteriaResults = similarityResult.criteriaResults;

			if (similarityScore < 5) {
				console.log(`Skipping lead for product ${productID} with similarity score ${similarityScore} due to low similarity`);
				skippedLeads.push(productID);
				continue;
			}

			// Make sure to multiply by 1000 to convert from seconds to milliseconds
			const date = new Date(Number(post.createdAt) * 1000);
			const dateString = date.toISOString();

			const lead = await db`
				INSERT INTO "PostLeads" (id, subreddit, title, author, body, url, "numComments", "subredditSubscribers", "over18", ups, downs, "productID", rating, "createdAt", "criteriaResults")
				VALUES (${post.id}, ${post.subreddit}, ${post.title}, ${post.author}, ${post.body}, ${post.url}, ${post.numComments}, ${post.subredditSubscribers}, ${post.over18}, ${post.ups}, ${post.downs}, ${productID}, ${similarityScore}, ${dateString}, ${criteriaResults})
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
	similarityResults: SimilarityResponse[],
	db: postgres.Sql,
	comment: Comment
): Promise<PushLeadsReturn> {
	try {
		const leadIDs: string[] = [];
		const skippedLeads: string[] = [];

		for (const similarityResult of similarityResults) {
			const productID = similarityResult.id;
			const similarityScore = similarityResult.score;
			const criteriaResults = similarityResult.criteriaResults;

			if (similarityScore < 5) {
				console.log(`Skipping lead for product ${productID} with similarity score ${similarityScore} due to low similarity`);
				skippedLeads.push(productID);
				continue;
			}

			// Make sure to multiply by 1000 to convert from seconds to milliseconds
			const date = new Date(Number(comment.createdAt) * 1000);
			const dateString = date.toISOString();

			const lead = await db`
				INSERT INTO "CommentLeads" (id, subreddit, author, body, url, ups, downs, "productID", rating, "createdAt", "criteriaResults")
				VALUES (${comment.id}, ${comment.subreddit}, ${comment.author}, ${comment.body}, ${comment.url}, ${comment.ups}, ${comment.downs}, ${productID}, ${similarityScore}, ${dateString}, ${criteriaResults})
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
