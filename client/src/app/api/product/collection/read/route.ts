import { collectionQueries } from '@/db';
import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { auth } from '../../../../../../auth';

export const GET = auth(async function GET(req: NextAuthRequest) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
    }

    const url = new URL(req.url);
    const productID = url.searchParams.get('productID');

    if (!productID) {
        return NextResponse.json(
            { error: 'Product ID required.' },
            { status: 400 }
        );
    }

    const collections =
        await collectionQueries.getProductCollections(productID);

    return NextResponse.json({ collections, status: 200 }, { status: 200 });
});

export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
    }

    const { productID } = await req.json();

    if (!productID) {
        return NextResponse.json(
            { error: 'Product ID required.' },
            { status: 400 }
        );
    }

    const collections =
        await collectionQueries.getProductCollections(productID);

    return NextResponse.json({ collections, status: 200 }, { status: 200 });
});
