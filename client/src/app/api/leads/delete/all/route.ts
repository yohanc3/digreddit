import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { eq } from 'drizzle-orm';

import { auth } from '../../../../../../auth';
import { db } from '@/db';
import { commentLeads, postLeads } from '@/db/schema';

/*
    Deletes ALL leads for a given productID
*/
export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth) {
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
    }

    const body = await req.json();
    const {
        productID,
        confirmation,
    }: { productID: string; confirmation: string } = body;

    if (!productID) {
        return NextResponse.json(
            { error: 'productID is required.' },
            { status: 400 }
        );
    }

    if (confirmation !== 'delete all') {
        return NextResponse.json(
            {
                error: 'Invalid confirmation. Please type "delete all" to confirm.',
            },
            { status: 400 }
        );
    }

    try {
        // Delete all post leads for the product
        await db.delete(postLeads).where(eq(postLeads.productID, productID));

        // Delete all comment leads for the product
        await db
            .delete(commentLeads)
            .where(eq(commentLeads.productID, productID));

        return NextResponse.json(
            { message: 'All leads deleted successfully.' },
            { status: 200 }
        );
    } catch (e) {
        console.error(
            'Error when deleting all leads from product id: ',
            productID,
            '. Error: ',
            e
        );
        return NextResponse.json(
            {
                error:
                    'Error when deleting all leads from product id: ' +
                    productID +
                    '. Error: ' +
                    e,
            },
            { status: 500 }
        );
    }
});
