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

    const allLeads = await leadsQueries.getAllLeadsByProductID(productID);

    return NextResponse.json({ allLeads }, { status: 200 });
});
