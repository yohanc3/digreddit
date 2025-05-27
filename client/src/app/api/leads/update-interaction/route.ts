import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { leadsQueries } from '@/db';

export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth)
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });

    const body = await req.json();

    const { leadID, isInteracted, isPost } = body;

    try {
        await leadsQueries.updateLeadInteraction(leadID, isInteracted, isPost);

        return NextResponse.json(
            { message: 'Lead interaction updated.' },
            { status: 200 }
        );
    } catch (e) {
        console.error('Error when updating lead interaction: ', e);
        return NextResponse.json(
            { error: 'Error when updating lead interaction.' },
            { status: 500 }
        );
    }
});
