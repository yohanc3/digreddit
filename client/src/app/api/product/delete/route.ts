import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { postLeads, products, commentLeads } from '@/db/schema';
import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { auth } from '../../../../../auth';

export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth)
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });

    const { productID } = await req.json();

    await db.delete(postLeads).where(eq(postLeads.productID, productID));

    await db.delete(commentLeads).where(eq(commentLeads.productID, productID));

    const product = await db
        .delete(products)
        .where(eq(products.id, productID))
        .returning({ id: products.id });

    return NextResponse.json({ product, status: 200 }, { status: 200 });
});
