import { userQueries } from '@/db';

/**
 * Refreshes an expired Reddit OAuth access token using the stored refresh token.
 *
 * FLOW OVERVIEW:
 * 1. Creates basic authentication header using Reddit client credentials
 * 2. Retrieves the user's stored refresh token from the database
 * 3. Makes a POST request to Reddit's OAuth token endpoint to exchange refresh token for new access token
 * 4. If successful and a callback is provided, executes the callback with the new access token
 * 5. Returns either the callback result (with access token included) or just the access token
 *
 * ERROR HANDLING:
 * - Database errors when retrieving refresh token
 * - Network errors when calling Reddit API
 * - Invalid refresh token scenarios (Reddit returns error)
 * - Callback execution failures
 *
 * @param userId - The database ID of the user whose token needs refreshing
 * @param onSuccess - Optional callback function to execute with the new access token.
 *                   Should return an object with `ok`, `status`, and optional `error` properties.
 *                   Commonly used to immediately make an API call with the fresh token.
 *
 * @returns Promise resolving to:
 *   - On success without callback: { accessToken: string, status: 200 }
 *   - On success with callback: { accessToken: string, ...callbackResult }
 *   - On error: { error: string|object, status: number }
 *
 * @example
 * // Simple token refresh
 * const result = await refreshRedditToken(userId);
 *
 * @example
 * // Refresh token and immediately fetch user data
 * const result = await refreshRedditToken(userId, fetchRedditUser);
 */
export async function refreshRedditToken(
    userId: string,
    onSuccess?: (accessToken: string) => Promise<{
        ok: boolean;
        status: number;
        error?: string;
        [key: string | number | symbol]: any;
    }>
) {
    const basicAuth = Buffer.from(
        `${process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID}:${process.env.REDDIT_SECRET}`
    ).toString('base64');

    try {
        const userRefreshToken =
            await userQueries.getRedditRefreshToken(userId);

        const tokens = await fetch(
            'https://www.reddit.com/api/v1/access_token',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${basicAuth}`,
                },
                body: `grant_type=refresh_token&refresh_token=${userRefreshToken}`,
            }
        );

        const res = await tokens.json();

        const accessToken = res.access_token;

        if (!tokens.ok) {
            console.error('Error when fetching new Reddit token', res);
            return {
                error: res,
                status: tokens.status,
            };
        }

        // If there's a callback, we need to call it and return the result
        if (onSuccess) {
            const result = await onSuccess(accessToken);

            console.log('result from callback', result);

            if (!result.ok) {
                return {
                    error: 'No result from callback',
                    status: result.status,
                };
            }

            return {
                accessToken,
                ...result,
            };
        }

        return {
            accessToken,
            status: 200,
        };
    } catch (error) {
        console.error('Error when refreshing Reddit token', error);
        return {
            error: 'Error when refreshing Reddit token',
            status: 500,
        };
    }
}
