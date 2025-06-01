import { NextResponse } from 'next/server';
import { productsQueries, userQueries } from '@/db';
import { NextAuthRequest } from 'next-auth';
import { auth } from '../../../../../auth';

export const GET = auth(async function GET(req: NextAuthRequest) {
    if (!req.auth || !req.auth.user?.id)
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    const basicAuth = Buffer.from(
        `${process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID}:${process.env.REDDIT_SECRET}`
    ).toString('base64');

    const tokens = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/callback/reddit`,
    });

    if (!tokens.ok) {
        return NextResponse.json(
            {
                message:
                    'An error occured when fetching your Reddit Auth Tokens',
            },
            { status: 400 }
        );
    }

    const data = await tokens.json();

    //store the reddit refresh token
    await userQueries.addRedditRefreshToken(
        data.refresh_token,
        req.auth.user.id
    );

    return NextResponse.json({ message: data }, { status: 200 });
});
