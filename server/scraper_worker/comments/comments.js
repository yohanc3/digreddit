import { CONSTANTS, redditAPIs } from '../utils/constants.js'
import { getCurrentUserAgent } from '../utils/user-agents.js'
import { getAverageThingsBatchCount } from '../utils/request_stats.js'
import { getSkippedPosts } from './queue.js'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { setOauthToken } from '../utils/oauth_token_helper.js'

// These lines help resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from parent directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export async function fetchRedditCommentsById(ids) {
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
            console.warn(
                'Token was invalid, resetting it and running fetchRedditCommentsById again...'
            )
            await setOauthToken()
            const postsByID = await fetchRedditPostByID()

            return postsByID
        }

        if (!response.ok)
            return { data: {}, ok: response.ok, headers: response.headers, status: response.status }

        const headers = response.headers

        const data = await response.json()

        return { data, headers, ok: response.ok, status: response.status }
    } catch (e) {
        console.error(
            'Error when fetching reddit post by id: ',
            e,
            '\n continuing fetch requests, server is not killed'
        )
        return { data: {}, headers: {}, ok: false, status: 400 }
    }
}

export async function fetchInitialPostID() {
    // Pulling the initial posts to get the id from

    const REDDIT_API_KEY = process.env.REDDIT_API_KEY

    try {
        const initialPost = await fetch(`${redditAPIs.allComments}?limit=3`, {
            headers: {
                'User-Agent': getCurrentUserAgent(),
                'Authorization': `bearer ${REDDIT_API_KEY}`,
            },
        })

        const initialPostJSON = await initialPost.json()

        if (
            Object.hasOwn(initialPostJSON, 'message') &&
            Object.hasOwn(initialPostJSON, 'error') &&
            initialPostJSON.error === 401
        ) {
            console.warn('Token was invalid, resetting it and running fetchInitialPostID again...')
            await setOauthToken()
            const initialPostID = await fetchInitialPostID()
            return initialPostID
        }

        const postsLength = initialPostJSON.data.children.length

        let initialPostID = initialPostJSON.data.children[postsLength - 1].data.id

        return initialPostID
    } catch (e) {
        console.error('Error when obtaining initial posts by id: ', e)
    }
}

export function getNextPostsBatchIDs(initialID) {
    const IDs = ['t3_' + initialID]

    const averagePostsPerBatch = Math.floor(getAverageThingsBatchCount())
    const isPostsPerBatchLessThanMin = averagePostsPerBatch < 90 && averagePostsPerBatch > 0

    let queuePosts = []
    if (isPostsPerBatchLessThanMin) {
        const averagePostsPerBatch = getAverageThingsBatchCount()

        queuePosts = getSkippedPosts(100 - averagePostsPerBatch)

        for (const queuePost of queuePosts) {
            IDs.push(`t3_${queuePost}`)
        }
    }

    const IDsLength = IDs.length

    for (let i = 1; i <= 100 - IDsLength; i++) {
        const nextPostIDBase10 = parseInt(initialID, 36) + i

        const nextPostIDBase36 = nextPostIDBase10.toString(36)

        IDs.push(`t3_${nextPostIDBase36}`)
    }

    return { IDs, queuePosts: queuePosts.length }
}
