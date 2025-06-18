import { NextResponse } from 'next/server';
import { bookmarkQueries, leadsQueries } from '@/db';
import { NextAuthRequest } from 'next-auth';
import { LeadFilters } from '@/types/backend/db';
import { auth } from '../../../../../auth';


export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth)
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });

    const body = await req.json();

    const { leadID, bookmarkID, isPost } = body;

    if (!leadID || !bookmarkID) {
        return NextResponse.json({
            error: 'Missing Fields',
            fields: body    
        }, { status: 400 });
    }

    try {
        const updatedLead = await bookmarkQueries.addBookmarkToLead(leadID, bookmarkID, isPost)

        return NextResponse.json(updatedLead, { status: 200 });
    } catch (e) {
        console.error(
            'Error when connecting Bookmark to a lead from lead id: ',
            leadID,
            '. Error: ',
            e
        );
        return NextResponse.json(
            {
                error:
                    'Error when connecting Bookmark to a lead from lead id: ' +
                    leadID +
                    '. Error: ' +
                    e,
            },
            { status: 500 }
        );
    }
})