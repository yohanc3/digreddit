import { redditAPIs } from '../utils/constants.js'
import { getCurrentUserAgent } from '../utils/user-agents.js'
import { getAverageThingsBatchCount } from '../utils/request_stats.js'
import { getSkippedThings } from './queue.js'
import { setOauthToken } from '../utils/oauth_token_helper.js'

export async function fetchRedditThingByID(ids) {
    /*
        Fetch posts from reddit's api given their id

        
        ids: string representing the ids to fetch, separated by a comma
    */

    const REDDIT_API_KEY = process.env.REDDIT_API_KEY

    // Use the url from reddit to request posts based on a set of ids
    const url = new URL(`${redditAPIs.info}`)
    url.search = new URLSearchParams({ id: ids }).toString()

    try {
        // fetch the data, headers and return it
        const response = await fetch(url, {
            headers: {
                'User-Agent': getCurrentUserAgent(),
                'Authorization': `bearer ${REDDIT_API_KEY}`,
            },
        })

        if (
            Object.hasOwn(response, 'message') &&
            Object.hasOwn(response, 'error') &&
            response.error === 401
        ) {
            console.warn('Token was invalid, resetting it and running fetchRedditPostID again...')
            await setOauthToken()
            const { data, ok, headers, status } = await fetchRedditThingByID(ids)

            return { data, ok, headers, status }
        }

        if (!response.ok)
            return { data: {}, ok: response.ok, headers: response.headers, status: response.status }

        const headers = response.headers

        const data = await response.json()

        return { data, headers, ok: response.ok, status: response.status }
    } catch (e) {
        console.error(
            'Error when fetching reddit thing by id: ',
            e,
            '\n continuing fetch requests, server is not killed'
        )
        return { data: {}, headers: {}, ok: false, status: 400 }
    }
}

export async function fetchInitialThingID(errorsNum = 0) {
    // Pulling the initial posts to get the id from

    const REDDIT_API_KEY = process.env.REDDIT_API_KEY

    const url = `${
        process.env.REDDIT_WORKER_THING_TYPE === 'posts'
            ? `${redditAPIs.allPosts}?limit=3`
            : `${redditAPIs.allComments}?limit=20`
    }`

    try {
        const initialThing = await fetch(url, {
            headers: {
                'User-Agent': getCurrentUserAgent(),
                'Authorization': `bearer ${REDDIT_API_KEY}`,
            },
        })

        console.log('initialThing: ', initialThing)

        const initialThingJSON = await initialThing.json()

        if (
            Object.hasOwn(initialThingJSON, 'message') &&
            Object.hasOwn(initialThingJSON, 'error') &&
            initialThingJSON.error === 401
        ) {
            if (errorsNum === 2) {
                throw new Error(
                    'Error when setting a new oauth token. Function was recursively called 2 times. It failed both times'
                )
            }

            console.warn('Token was invalid, resetting it and running fetchinitialThingID again...')
            await setOauthToken()
            const initialThingID = await fetchInitialThingID(errorsNum++)

            return initialThingID
        }

        const thingsLength = initialThingJSON.data.children.length

        if (thingsLength === 0) {
            throw new Error('No things found. Children is an empty array')
        }

        let initialThingID = initialThingJSON.data.children[thingsLength - 1].data.id

        return initialThingID
    } catch (e) {
        console.error('Error when obtaining initial things by id: ', e)
    }
}

export function getNextThingBatchIDs(initialID) {
    const prefix = process.env.REDDIT_WORKER_THING_TYPE === 'posts' ? 't3_' : 't1_'

    const IDs = [prefix + initialID]

    const averageThingsPerBatch = Math.floor(getAverageThingsBatchCount())
    const isPostsPerBatchLessThanMin = averageThingsPerBatch < 90 && averageThingsPerBatch > 0

    // queue is to be deleted for now
    let queueThings = []
    if (isPostsPerBatchLessThanMin) {
        const averageThingsPerBatch = getAverageThingsBatchCount()

        queueThings = getSkippedThings(100 - averageThingsPerBatch)

        for (const queueThing of queueThings) {
            IDs.push(prefix + queueThing)
        }
    }

    const IDsLength = IDs.length

    for (let i = 1; i <= 100 - IDsLength; i++) {
        const nextThingIDBase10 = parseInt(initialID, 36) + i

        const nextThingIDBase36 = nextThingIDBase10.toString(36)

        IDs.push(prefix + nextThingIDBase36)
    }

    return { IDs, queueThings: queueThings.length }
}
