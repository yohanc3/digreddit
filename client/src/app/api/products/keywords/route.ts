import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { auth } from '../../../../../auth';
import { openai } from '@/lib/backend/ai/connection';
import { generateKeywordsPrompt } from '@/lib/backend/constant/keywords';
import {
    parseKeywordString,
    isValidKeywordJsonString,
} from '@/lib/backend/utils/keywords';

export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth || !req.auth.user?.id)
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });

    const body = await req.json();

    const { title, description, industry } = body;
    const userId = req.auth.user.id;

    if (!title || !description || !industry || !userId) {
        return NextResponse.json({ error: 'Missing Fields' }, { status: 400 });
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: generateKeywordsPrompt,
                },
                {
                    role: 'user',
                    content: JSON.stringify({
                        title: title,
                        description: description,
                        industry: industry,
                    }),
                },
            ],
            model: 'deepseek-chat',
        });

        const generatedKeywords = completion.choices[0].message.content!;

        if (isValidKeywordJsonString(generatedKeywords)) {
            const result = parseKeywordString(generatedKeywords);
            return NextResponse.json(result, { status: 200 });
        } else {
            throw new Error('AI Response value is not a valid array');
        }
    } catch (error) {
        console.error('Error generating keywords:', (error as Error).message);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
});
