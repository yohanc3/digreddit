import { collectionQueries } from '@/db';
import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { auth } from '../../../../../../auth';

export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
    }
    const userID = req.auth.user.id;

    const { productID, title, description, subreddits } = await req.json();

    if (
        !productID ||
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

    const collection = await collectionQueries.createCollection(
        productID,
        title,
        description,
        subreddits,
        userID
    );

    return NextResponse.json({ collection, status: 200 }, { status: 200 });
});
