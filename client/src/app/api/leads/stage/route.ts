import { NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { leadsQueries } from '@/db';
import { NextAuthRequest } from 'next-auth';
import { LeadStage } from '@/types/backend/db';

/*
    Updates the stage of a lead (post or comment)

    string leadID: ID of the lead to update
    LeadStage stage: new stage to set
    boolean isPost: whether the lead is a post (true) or comment (false)
*/
export const PUT = auth(async function PUT(req: NextAuthRequest) {
    if (!req.auth)
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });

    const body = await req.json();

    const { leadID, stage, isPost } = body;

    // Validate required fields
    if (!leadID || !stage || typeof isPost !== 'boolean') {
        return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
        );
    }

    // Validate stage value
    const validStages: LeadStage[] = [
        'identification',
        'initial_outreach',
        'engagement',
    ];

    if (!validStages.includes(stage)) {
        return NextResponse.json(
            {
                error: 'Invalid stage. Must be one of: identification, initial_outreach, engagement',
            },
            { status: 400 }
        );
    }

    try {
        const updatedLead = await leadsQueries.updateLeadStage(
            leadID,
            stage,
            isPost
        );

        return NextResponse.json({ updatedLead }, { status: 200 });
    } catch (e) {
        console.error(
            'Error when updating lead stage for lead id: ',
            leadID,
            '. Error: ',
            e
        );
        return NextResponse.json(
            {
                error:
                    'Error when updating lead stage for lead id: ' +
                    leadID +
                    '. Error: ' +
                    e,
            },
            { status: 500 }
        );
    }
});
