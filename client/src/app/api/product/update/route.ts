import { NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { productsQueries } from '@/db';
import { NextAuthRequest } from 'next-auth';

/*
    Gets all leads given a productID

    string productID: product whose leads will be returned
*/
export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth)
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });

    const body = await req.json();

    const { productID, title, description, keywords } = body;

    try {
        if (
            !productID &&
            !title &&
            !description &&
            !keywords &&
            !Array.isArray(keywords)
        ) {
            return NextResponse.json(
                { error: 'Missing Fields' },
                { status: 400 }
            );
        }

        await productsQueries.updateProductByID(
            productID,
            title,
            description,
            keywords
        );

        return NextResponse.json({ ok: true, status: 200 }, { status: 200 });
    } catch (e) {
        console.error('Error when updating product fields: ', e);
        return NextResponse.json({ error: 'Internal Error.' }, { status: 500 });
    }
});
