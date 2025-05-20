import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { leadsQueries } from '@/db';
import { NextAuthRequest } from 'next-auth';

/*
    Gets all leads given a productID

    string productID: product whose leads will be returned
*/
export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth)
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });

    const body = await req.json();

    const { productID } = body;

    try {
        const allLeads = await leadsQueries.getAllLeadsByProductID(productID);

        return NextResponse.json({ allLeads }, { status: 200 });
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
