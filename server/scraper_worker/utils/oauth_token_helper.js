export async function setOauthToken() {
    const username = process.env.REDDIT_USERNAME
    const password = process.env.REDDIT_PASSWORD
    const clientID = process.env.REDDIT_CLIENTID
    const clientSecret = process.env.REDDIT_CLIENT_SECRET

    const credentials = Buffer.from(`${clientID}:${clientSecret}`).toString('base64')

    try {
        const res = await fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            body: new URLSearchParams({
                grant_type: 'password',
                username,
                password,
            }),
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
            },
        })

        const jsonRes = await res.json()

        if (Object.hasOwn(jsonRes, 'access_token')) {
            console.log('api key is: ', jsonRes)
            process.env.REDDIT_API_KEY = jsonRes.access_token
            return
        } else {
            throw new Error(`Access token was not given. ${JSON.stringify(jsonRes)}`)
        }
    } catch (e) {
        console.log('Error when loading oauth token: ', e)
        return
    }
}

async function cleanupBeforeExit() {
    const clientID = process.env.REDDIT_CLIENTID
    const clientSecret = process.env.REDDIT_CLIENT_SECRET

    const credentials = Buffer.from(`${clientID}:${clientSecret}`).toString('base64')

    try {
        const res = await fetch('https://www.reddit.com/api/v1/revoke_token', {
            method: 'POST',
            body: new URLSearchParams({
                token: process.env.REDDIT_API_KEY,
                token_type_hint: 'access_token',
            }),
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
            },
        })
    } catch (e) {
        console.log(
            '\nError when revoking token: ',
            e,
            '\nrevoke the token manually by running the following curl query: ',
            `curl -X POST -d "token=${process.env.REDDIT_API_KEY}&token_type_hint=access_token" --user '${clientID}:${clientSecret}' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36' https://www.reddit.com/api/v1/revoke_token`
        )
        return
    }
}

export function registerExitHandler() {
    process.on('SIGINT', async () => {
        await cleanupBeforeExit()
        process.exit()
    })

    process.on('exit', async () => {
        await cleanupBeforeExit()
    })
}