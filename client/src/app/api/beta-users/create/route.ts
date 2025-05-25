import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { nonBetaUsersQueries } from '@/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const { email } = body;

        await nonBetaUsersQueries.addNonBetaUserEmail(email);

        return NextResponse.json(
            { message: 'Email added to waitlist.' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Error adding email to waitlist.' },
            { status: 500 }
        );
    }
}
