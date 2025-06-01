export async function fetchRedditUser(accessToken: string): Promise<{
    userDetails?: any;
    error?: string;
    status: number;
    ok: boolean;
}> {
    try {
        const response = await fetch('https://oauth.reddit.com/api/v1/me', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const userDetails = await response.json();

        if (!response.ok) {
            console.error('Error fetching Reddit user', userDetails);
            return {
                error: 'Error fetching Reddit user',
                status: response.status,
                ok: false,
            };
        }

        return {
            ...userDetails,
            status: 200,
            ok: true,
        };
    } catch (error) {
        console.error('Error fetching Reddit user', error);
        return {
            error: 'Error fetching Reddit user',
            status: 500,
            ok: false,
        };
    }
}
