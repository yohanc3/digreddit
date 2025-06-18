import { collectionQueries } from '@/db';
import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { auth } from '../../../../../auth';

export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
    }
    const userID = req.auth.user.id;

    if (!userID) {
        return NextResponse.json({ error: 'Not authorized.' }, { status: 400 });
    }

    const allUserCollections =
        await collectionQueries.getUserCollections(userID);
    return NextResponse.json(
        { collections: allUserCollections, status: 200 },
        { status: 200 }
    );
});
