import { NextResponse } from 'next/server';
import { userQueries } from '@/db';
import { NextAuthRequest } from 'next-auth';
import { auth } from '../../../../../auth';
import { refreshRedditToken } from '@/lib/backend/utils/reddit/redditRefreshToken';
import { commentOnReddit } from '@/lib/backend/utils/reddit/comment';

export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
    }

    const userId = req.auth.user.id;

    try {
        const body = await req.json();

        console.log('body', body);

        if (
            !body.accessToken ||
            !body.thingID ||
            !body.comment ||
            typeof body.isPost !== 'boolean'
        ) {
            return NextResponse.json(
                { error: 'No access token provided' },
                { status: 400 }
            );
        }

        const { accessToken, thingID, comment, isPost } = body;

        const isRedditConnected =
            await userQueries.checkRedditConnection(userId);
        if (!isRedditConnected) {
            return NextResponse.json(
                { error: 'Not connected' },
                { status: 401 }
            );
        }

        const commentResult = await commentOnReddit(
            accessToken,
            thingID,
            comment,
            isPost
        );

        if (!commentResult.ok) {
            // If the token is expired, we need to refresh it.
            // Additionally, we pass in the commentOnReddit function to get the comment result on success.
            // This is because the refreshRedditToken function returns the new access_token, but we need to get the comment result with the new access_token.

            const commentOnRedditWrapper = async (newAccessToken: string) => {
                return await commentOnReddit(
                    newAccessToken,
                    thingID,
                    comment,
                    isPost
                );
            };

            if (commentResult.status === 403) {
                const commentResultFromNewToken = await refreshRedditToken(
                    userId,
                    commentOnRedditWrapper
                );

                if (commentResultFromNewToken.error) {
                    console.error(
                        'Error refreshing Reddit token',
                        commentResultFromNewToken
                    );
                    return NextResponse.json(
                        { message: commentResultFromNewToken.error },
                        { status: commentResultFromNewToken.status }
                    );
                }

                return NextResponse.json(commentResultFromNewToken, {
                    status: 200,
                });
            }

            console.error('Error posting comment');
            return NextResponse.json(
                { message: 'Internal error posting comment' },
                { status: 500 }
            );
        }

        return NextResponse.json(commentResult, { status: 200 });
    } catch (error) {
        console.error('Internal error fetching Reddit user', error);
        return NextResponse.json(
            { message: 'Internal error fetching Reddit user' },
            { status: 500 }
        );
    }
});
