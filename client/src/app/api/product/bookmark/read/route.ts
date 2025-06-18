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

    const { productID } = await req.json();

    if (!userID) {
        return NextResponse.json({ error: 'Not authorized.' }, { status: 400 });
    }
    if (productID) {
        const productBookmarks = await bookmarkQueries.getProductBookmarks(productID)
        return NextResponse.json({ bookmarks: productBookmarks, status: 200 }, { status: 200 });
    } else {
        const allUserBookmarks = await bookmarkQueries.getUserBookmarks(userID)
        return NextResponse.json({ bookmarks: allUserBookmarks, status: 200 }, { status: 200 });
    }
});
