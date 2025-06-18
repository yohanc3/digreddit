/**
 * AI prompt templates for lead evaluation criteria generation
 */

/**
 * Creates the base prompt for generating lead evaluation criteria
 * @param productInfo - Object containing product information
 * @param userPreferences - Array of user preference strings
 * @returns Complete prompt string for AI generation
 */
export function createCriteriaPrompt(
    productInfo: {
        title?: string;
        description: string;
    },
    userPreferences: string[] = []
): string {
    const productSection = productInfo.title
        ? `Product Title: ${productInfo.title}
Product Description: ${productInfo.description}`
        : `Product Description: ${productInfo.description}`;

    return `You are an expert at creating lead evaluation criteria for business products. Based on the product description and user preferences provided, create a comprehensive lead evaluation system.

${productSection}

${
    userPreferences.length > 0
        ? `User Preferences:
${userPreferences.join('\n')}

`
        : ''
}Create lead evaluation criteria that will help score potential customers/leads for this product. The criteria should:
1. Total exactly 10 points across all criteria
2. Have 2-4 different criteria categories
3. Use range-based scoring (e.g., "4-5 points", "2-3 points", etc.) for scores above 3
4. Include clear, specific descriptions for each score level
5. Focus on factors like: experience relevance, budget alignment, company size, need urgency, decision-making authority, etc.

Return your response as a JSON object in this EXACT format:
{
  "criteria": [
    {
      "name": "Brief criteria name (2-4 words)",
      "max": 6,
      "ranges": [
        {"pts": "6", "desc": "15-word description of what qualifies for maximum points"},
        {"pts": "4-5", "desc": "15-word description of what qualifies for this range"},
        {"pts": "2-3", "desc": "15-word description of what qualifies for this range"},
        {"pts": "1", "desc": "15-word description of what qualifies for 1 point"},
        {"pts": "0", "desc": "15-word description of what qualifies for 0 points"}
      ]
    }
  ],
  "total": 10
}

Make sure:
- All "max" values sum to exactly 10
- Each description is 15 words or less
- Criteria names are brief but descriptive
- Score ranges make logical sense (highest = best fit)
- Return ONLY the JSON object, no other text`;
}

/**
 * System message for AI criteria generation
 */
export const CRITERIA_SYSTEM_MESSAGE =
    'You are a business intelligence expert who creates precise lead scoring criteria. Always respond with valid JSON only.';

/**
 * AI model configuration for criteria generation
 */
export const CRITERIA_AI_CONFIG = {
    temperature: 0.7,
    max_tokens: 2000,
} as const;
