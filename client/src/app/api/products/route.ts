import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { productsQueries } from '@/db';
import { NextAuthRequest } from 'next-auth';

export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth || !req.auth.user?.id)
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });

    const body = await req.json();

    const { title, description, url, mrr, industry, keywords, criteria } = body;
    const userId = req.auth.user.id;

    const userLimit = await productsQueries.isProductLimitReached(userId);

    if (userLimit)
        return NextResponse.json({ error: 'Beta Limit' }, { status: 403 });

    if (!title || !description || !industry || !keywords || !userId) {
        return NextResponse.json({ error: 'Missing Fields' }, { status: 400 });
    }

    const createdProduct = await productsQueries.createProduct({
        title,
        description,
        url,
        mrr: Number(mrr || 0),
        industry,
        keywords,
        userId,
        criteria: criteria || '',
    });

    return NextResponse.json({ createdProduct }, { status: 200 });
});

export const GET = auth(async function GET(req: NextAuthRequest) {
    if (!req.auth || !req.auth.user?.id)
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });

    const userId = req.auth.user.id;

    const userProducts = await productsQueries.getAllProductsByUserID(userId);

    return NextResponse.json({ userProducts }, { status: 200 });
});
