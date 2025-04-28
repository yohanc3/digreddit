import { CONSTANTS } from '../utils/constants.js'
import { getCurrentUserAgent } from '../utils/user-agents.js'
import { getAveragePostsBatchCount } from '../utils/request_stats.js'
import { getSkippedPosts } from './queue.js'

export const redditAPIs = {
    all: 'https://www.reddit.com/r/all/new/.json',
    allComments: 'https://www.reddit.com/r/all/comments/.json',
    post: 'https://api.reddit.com/api/info.json',
}

export async function fetchRedditPostByID(ids) {
    /*
        Fetch posts from reddit's api given their id

        
        ids: string representing the ids to fetch, separated by a comma
    */

    // Use the url from reddit to request posts based on a set of ids
    const url = new URL(`${redditAPIs.post}`)
    url.search = new URLSearchParams({ id: ids }).toString()

    try {
        // fetch the data, headers and return it
        const response = await fetch(url, {
            headers: {
                'User-Agent': getCurrentUserAgent(),
            },
        })

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
    const initialPost = await fetch(`${redditAPIs.all}?limit=2`, {
        headers: {
            'User-Agent': getCurrentUserAgent(),
        },
    })
    const initialPostJSON = await initialPost.json()

    let initialPostID = initialPostJSON.data.children[0].data.id

    return initialPostID
}

export function getNextPostsBatchIDs(initialID) {
    const IDs = ['t3_' + initialID]

    const averagePostsPerBatch = Math.floor(getAveragePostsBatchCount())
    const isPostsPerBatchLessThanMin =
        averagePostsPerBatch < 90 && averagePostsPerBatch > 0

    let queuePosts = [];
    if (isPostsPerBatchLessThanMin) {
        const averagePostsPerBatch = getAveragePostsBatchCount()

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

    return {IDs, queuePosts: queuePosts.length}
}
