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

    const { productID, title, description } = await req.json();

    if (!productID || !title || !userID || !description) {
        return NextResponse.json({ error: 'Not authorized.' }, { status: 400 });
    }

    const bookmark = await bookmarkQueries.createBookmark(productID, title, description, userID)
    
    return NextResponse.json({ bookmark, status: 200 }, { status: 200 });
});
