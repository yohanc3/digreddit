import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { auth } from '../../../../../auth';
import { geminiAI, openai } from '@/lib/backend/ai/connection';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { products } from '@/db/schema';

const generateResponsePrompt = (productDescription: string) => {
    return `
Your job is to genuinely interact with a lead given a product description, by providing value to the conversation.

Here's an example of a good response message (not for this lead, but just in general)

"Hi. It seems like you may need to look into how LLM training is done to achieve your goals, if you're not too familiar, you may benefit from a crash course and learn the rest as you go (although this has lots of cons). I think my tool could be of some help to you, it generates leads 24/7 and compares it against your product, then it gives it a rating and if it's high enough (you choose how high) it auto-engages with it. Lmk if its something you'd be interested in trying out"

Make your messages with an EXACT SAME structure, which is broken down here:

1. YOU PROVIDE GENUINE HELP!!! this is the most important part of the message. (in the example:  "It seems like you may need to look into how LLM training is done to achieve your goals, if you're not too familiar, you may benefit from a crash course and learn the rest as you go (although this has lots of cons")

2. You offering the tool in a casual way, no build up, there is no rush, no emotion, or excitement (in the example: I think my tool could be of some help to you, it generates leads 24/7 and compares it against your product, then it gives it a rating and if it's high enough (you choose how high) it auto-engages with it)

3. Let the user know they can ask if they're interested, again, no rush, panic, emotion, etc. (in the example: Lmk if its something you'd be interested in trying out)

DO NOT:
1. Use dashes of any kind
2. Exclamation marks
3. Any colloquial expressions (example: "No pressure though!" (makes it sound like you are shilling))
4. Perfect grammar. Make sure to never start a letter with an uppercase, but for the first word in the text.

Product description:
${productDescription}

Generate a response following this exact structure.`;
};

export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth || !req.auth.user?.id)
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });

    const body = await req.json();

    const { leadMessage, productID } = body;
    const userId = req.auth.user.id;

    if (!leadMessage || !userId || !productID) {
        return NextResponse.json({ error: 'Missing Fields' }, { status: 400 });
    }

    try {
        const product = await db.query.products.findFirst({
            where: eq(products.id, productID),
        });
        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }
        const productDescription = product.description;

        const completion = await geminiAI.models.generateContent({
            model: 'gemini-2.0-flash',
            config: {
                systemInstruction: generateResponsePrompt(productDescription),
            },
            contents: `Potential lead message: ${leadMessage}`,
        });

        const generatedResponse = completion.text;

        return NextResponse.json({ generatedResponse }, { status: 200 });
    } catch (error) {
        console.error('Error generating response:', (error as Error).message);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
});
