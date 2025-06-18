import { NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { NextAuthRequest } from 'next-auth';
import { llamaAI, LLAMA_MODEL } from '@/lib/backend/ai/connection';

/*
    Generates AI-powered lead evaluation criteria for product creation
    
    Body: { description: string, idealCustomer?: string, additionalInstructions?: string }
    Returns: JSON criteria in the format expected by the frontend
*/
export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth)
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });

    try {
        const body = await req.json();
        const { description, idealCustomer, additionalInstructions } = body;

        if (!description || !description.trim()) {
            return NextResponse.json(
                { error: 'description is required' },
                { status: 400 }
            );
        }

        // Create AI prompt for generating criteria
        const userPreferences = [];
        if (idealCustomer && idealCustomer.trim()) {
            userPreferences.push(`Customer Profile: ${idealCustomer.trim()}`);
        }
        if (additionalInstructions && additionalInstructions.trim()) {
            userPreferences.push(
                `Special Instructions: ${additionalInstructions.trim()}`
            );
        }

        const prompt = `You are an expert at creating lead evaluation criteria for business products. Based on the product description and user preferences provided, create a comprehensive lead evaluation system.

Product Description: ${description.trim()}

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

        // Call Llama AI
        const response = await llamaAI.chat.completions.create({
            model: LLAMA_MODEL,
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a business intelligence expert who creates precise lead scoring criteria. Always respond with valid JSON only.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        const aiResponse = response.choices[0]?.message?.content;

        if (!aiResponse) {
            return NextResponse.json(
                { error: 'No response from AI' },
                { status: 500 }
            );
        }

        // Parse and validate the AI response
        let criteriaData;
        try {
            // Clean the response in case there's extra text
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);

            const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
            criteriaData = JSON.parse(jsonString);

            // Validate the structure
            if (
                !criteriaData.criteria ||
                !Array.isArray(criteriaData.criteria) ||
                !criteriaData.total
            ) {
                throw new Error('Invalid criteria structure');
            }

            // Validate total points
            const calculatedTotal = criteriaData.criteria.reduce(
                (sum: number, criteria: any) => sum + (criteria.max || 0),
                0
            );
            if (calculatedTotal !== 10) {
                throw new Error(
                    `Total points must equal 10, got ${calculatedTotal}`
                );
            }
        } catch (parseError) {
            console.error('Error parsing AI response:', parseError);
            console.error('AI Response:', aiResponse);
            return NextResponse.json(
                { error: 'Invalid AI response format' },
                { status: 500 }
            );
        }

        console.log('Criteria data:', JSON.stringify(criteriaData, null, 2));
        return NextResponse.json(
            {
                success: true,
                criteria: criteriaData,
                message: 'Criteria generated successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error generating criteria:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
});
