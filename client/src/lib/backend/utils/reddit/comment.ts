export async function commentOnReddit(
    accessToken: string,
    thingID: string,
    comment: string,
    isPost: boolean
) {
    try {
        const commentResult = await fetch(
            'https://oauth.reddit.com/api/comment',
            {
                method: 'POST',
                body: new URLSearchParams({
                    api_type: 'json',
                    thing_id: `${isPost ? 't3_' : 't1_'}${thingID}`,
                    text: comment,
                }),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'User-Agent':
                        'macos:www.digreddit.net:v1.0.0 (by /u/yohanc32)',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept-Encoding': 'gzip, deflate, br',
                    Connection: 'keep-alive',
                    Accept: '*/*',
                },
            }
        );

        if (!commentResult.ok) {
            return {
                error: 'Error posting comment',
                status: commentResult.status,
                ok: false,
            };
        }

        return {
            status: 200,
            ok: true,
        };
    } catch (error) {
        console.error('Error posting comment', error);
        return {
            error: 'Error posting comment',
            status: 500,
            ok: false,
        };
    }
}
