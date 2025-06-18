import { NextResponse } from 'next/server';
import { auth } from '../../../../../../auth';
import { productsQueries } from '@/db';
import { NextAuthRequest } from 'next-auth';
import { llamaAI, LLAMA_MODEL } from '@/lib/backend/ai/connection';
import {
    createCriteriaPrompt,
    CRITERIA_SYSTEM_MESSAGE,
    CRITERIA_AI_CONFIG,
} from '@/lib/backend/constant/criteriaPrompts';

/*
    Generates AI-powered lead evaluation criteria based on existing product data
    
    Body: { productID: string, idealCustomer?: string, additionalInstructions?: string }
    Returns: JSON criteria in the format expected by the frontend
*/
export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth)
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });

    try {
        const body = await req.json();
        const { productID, idealCustomer, additionalInstructions } = body;

        if (!productID) {
            return NextResponse.json(
                { error: 'productID is required' },
                { status: 400 }
            );
        }

        // Get product from database
        const product = await productsQueries.getProductByID(productID);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Create user preferences array
        const userPreferences = [];
        if (idealCustomer && idealCustomer.trim()) {
            userPreferences.push(`Customer Profile: ${idealCustomer.trim()}`);
        }
        if (additionalInstructions && additionalInstructions.trim()) {
            userPreferences.push(
                `Special Instructions: ${additionalInstructions.trim()}`
            );
        }

        // Generate prompt using constants with both title and description
        const prompt = createCriteriaPrompt(
            {
                title: product.title,
                description: product.description,
            },
            userPreferences
        );

        // Call Llama AI
        const response = await llamaAI.chat.completions.create({
            model: LLAMA_MODEL,
            messages: [
                {
                    role: 'system',
                    content: CRITERIA_SYSTEM_MESSAGE,
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            ...CRITERIA_AI_CONFIG,
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
