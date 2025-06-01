import { NextResponse } from 'next/server';
import { userQueries } from '@/db';
import { NextAuthRequest } from 'next-auth';
import { auth } from '../../../../../auth';
import { refreshRedditToken } from '@/lib/backend/utils/reddit/redditRefreshToken';
import { fetchRedditUser } from '@/lib/backend/utils/reddit/fetchUser';

/**
 * POST /api/reddit/me - Fetches Reddit user profile data with automatic token refresh
 *
 * AUTHENTICATION FLOW:
 * 1. Validates user session via NextAuth
 * 2. Verifies user has connected Reddit account in database
 * 3. Attempts to fetch Reddit user data using provided access token
 * 4. If token is expired (403 error), automatically refreshes it and retries
 * 5. Returns either fresh user data or error response
 *
 * TOKEN REFRESH LOGIC:
 * - When Reddit API returns 403 (forbidden/expired), triggers automatic refresh
 * - Uses refreshRedditToken() with fetchRedditUser callback for seamless retry
 * - The callback pattern ensures user data is fetched immediately with new token
 * - Handles refresh failures gracefully with proper error responses
 *
 * REQUEST BODY:
 * - accessToken: string (Reddit OAuth access token, may be expired)
 *
 * RESPONSE FORMATS:
 * - 200: Reddit user profile data (username, karma, etc.)
 * - 400: Missing access token in request
 * - 401: User not authenticated or Reddit not connected
 * - 500: Internal server errors (network, database, etc.)
 *
 * ERROR SCENARIOS:
 * - No user session
 * - Missing access token in request body
 * - User hasn't connected Reddit account
 * - Reddit API errors (network, rate limits, etc.)
 * - Token refresh failures
 * - Database connection issues
 *
 * @param req - NextAuth-enhanced request with user session
 * @returns NextResponse with Reddit user data or error details
 *
 * @example
 * // Client usage
 * const response = await fetch('/api/reddit/me', {
 *   method: 'POST',
 *   body: JSON.stringify({ accessToken: userToken })
 * });
 */
export const POST = auth(async function POST(req: NextAuthRequest) {
    if (!req.auth || !req.auth.user?.id) {
        return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
    }

    const userId = req.auth.user.id;

    try {
        const body = await req.json();

        if (!body.accessToken) {
            return NextResponse.json(
                { error: 'No access token provided' },
                { status: 400 }
            );
        }

        //Note from Adriel"
        // We don't validate the existence of access_token btw,
        // we'll refresh it if it's falsy or expired
        const { accessToken } = body;

        const isRedditConnected =
            await userQueries.checkRedditConnection(userId);
        if (!isRedditConnected) {
            return NextResponse.json(
                { error: 'Not connected' },
                { status: 401 }
            );
        }

        const redditUser = await fetch('https://oauth.reddit.com/api/v1/me', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!redditUser.ok) {
            // If the token is expired, we need to refresh it.
            // Additionally, we pass in the fetchRedditUser function to get the user details on success.
            // This is because the refreshRedditToken function returns the new access_token, but we need to get the user details with the new access_token.
            if (redditUser.status === 403) {
                const userData = await refreshRedditToken(
                    userId,
                    fetchRedditUser
                );

                if (userData.error) {
                    console.error('Error refreshing Reddit token', userData);
                    return NextResponse.json(
                        { message: userData.error },
                        { status: userData.status }
                    );
                }

                return NextResponse.json(userData, { status: 200 });
            }

            console.error('Error fetching Reddit user', redditUser);
            return NextResponse.json(
                { message: 'Internal error fetching Reddit user' },
                { status: 500 }
            );
        }

        const userDetails = await redditUser.json();

        return NextResponse.json(userDetails, { status: 200 });
    } catch (error) {
        console.error('Internal error fetching Reddit user', error);
        return NextResponse.json(
            { message: 'Internal error fetching Reddit user' },
            { status: 500 }
        );
    }
});
