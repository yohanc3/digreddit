import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { leadsQueries } from '@/db';
import { NextAuthRequest } from 'next-auth';
import { LeadFilters } from '@/types/backend/db';

/*
    Gets all leads given a productID with pagination support and filters

    string productID: product whose leads will be returned
    number pagesOffset: offset for pagination (default: 0)
    LeadFilters filters: optional filters to apply
*/
export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth)
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });

    const body = await req.json();

    const { productID, pagesOffset = 0, filters } = body;

    try {
        const allLeads = await leadsQueries.getAllLeadsByProductID(
            productID,
            pagesOffset,
            filters
        );
        const totalCount = await leadsQueries.getTotalLeadsCountByProductID(
            productID,
            filters
        );

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
