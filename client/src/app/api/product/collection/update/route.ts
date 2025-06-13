import { collectionQueries } from '@/db';
import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { auth } from '../../../../../../auth';

export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
    }
    const userID = req.auth.user.id;

    const { collectionID, title, description, subreddits } = await req.json();

    if (
        !collectionID ||
        !title ||
        !userID ||
        !description ||
        !subreddits ||
        !Array.isArray(subreddits)
    ) {
        return NextResponse.json(
            { error: 'Missing required fields.' },
            { status: 400 }
        );
    }

    const collection = await collectionQueries.updateCollection(
        collectionID,
        title,
        description,
        subreddits,
        userID
    );

    return NextResponse.json({ collection, status: 200 }, { status: 200 });
});
