import { db, feedbackQueries } from '@/db';
import { auth } from '../../../../../auth';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';

export const POST = auth(async (req: NextAuthRequest) => {
    if (!req.auth || !req.auth.user) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { user } = req.auth;

    if (!user.id) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const { area, feedback } = await req.json();

        await feedbackQueries.createFeedback(area, feedback, user.id);

        return NextResponse.json(
            { message: 'Feedback created' },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
});
