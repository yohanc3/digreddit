import { NextResponse } from 'next/server';
import { userQueries } from '@/db';
import { NextAuthRequest } from 'next-auth';
import { auth } from '../../../../../auth';

export const POST = auth(async function POST(req: NextAuthRequest) {

    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
    }

    const userId = req.auth.user.id;

    const body = await req.json();

    //Note from Adriel"
    // We don't validate the existence of access_token btw,
    // we'll refresh it if it's falsy or expired
    const { access_token } = body;

    const isRedditConnected = await userQueries.checkRedditConnection(userId);
    if (!isRedditConnected) {
        return NextResponse.json({ error: 'Not connected' }, { status: 401 });
    }

    const redditUser = await fetch("https://oauth.reddit.com/api/v1/me", {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    });

    if (!redditUser.ok) {

        if (redditUser.status === 403) {
            const basicAuth = Buffer.from(
                `${process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID}:${process.env.REDDIT_SECRET}`
            ).toString('base64');

            const userRefreshToken = await userQueries.getRedditRefreshToken(userId);

            const tokens = await fetch("https://www.reddit.com/api/v1/access_token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${basicAuth}`
                },
                body: `grant_type=refresh_token&refresh_token=${userRefreshToken}`
            });

            const res = await tokens.json();

            if (!tokens.ok) {
                return NextResponse.json(res, { status: tokens.status });
            }

            const freshRedditUser = await fetch("https://oauth.reddit.com/api/v1/me", {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${res.access_token}`
                }
            });

            if(!freshRedditUser.ok) return NextResponse.json({message: "Something went wrong"}, { status: 500 });

            const freshUserDetails = await freshRedditUser.json();

            return NextResponse.json({...freshUserDetails, access_token: res.access_token}, { status: 200 });
        }

        return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }

    const userDetails = await redditUser.json();
    
    return NextResponse.json(userDetails, { status: 200 });
});
