import { eq } from 'drizzle-orm';
import { bookmarkQueries, db } from '@/db';
import { postLeads, products, commentLeads } from '@/db/schema';
import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { auth } from '../../../../../../auth';

export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
    }
    const userID = req.auth.user.id;

    const { bookmarkID } = await req.json();

    if (!bookmarkID || !userID) {
        return NextResponse.json({ error: 'Missing Fields.' }, { status: 400 });
    }

    const deletedBookmark = await bookmarkQueries.deleteBookmark(bookmarkID, userID)

    return NextResponse.json({ deletedBookmark, status: 200 }, { status: 200 });
});
