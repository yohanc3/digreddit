import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { leadsQueries } from '@/db';
import { NextAuthRequest } from 'next-auth';

/*
    Gets all leads given a productID with pagination support

    string productID: product whose leads will be returned
    number pagesOffset: offset for pagination (default: 0)
*/
export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth)
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });

    const body = await req.json();

    const { productID, pagesOffset = 0 } = body;

    try {
        const allLeads = await leadsQueries.getAllLeadsByProductID(
            productID,
            pagesOffset
        );
        const totalCount =
            await leadsQueries.getTotalLeadsCountByProductID(productID);

        return NextResponse.json({ allLeads, totalCount }, { status: 200 });
    } catch (e) {
        console.error(
            'Error when fetching all leads from product id: ',
            productID,
            '. Error: ',
            e
        );
        return NextResponse.json(
            {
                error:
                    'Error when fetching all leads from product id: ' +
                    productID +
                    '. Error: ' +
                    e,
            },
            { status: 500 }
        );
    }
});
