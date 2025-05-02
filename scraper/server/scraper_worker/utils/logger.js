import { getAllSkippedOverPosts } from '../posts/queue.js'
import { getAveragePostsBatchCount } from './request_stats.js'

export function logInfo(postsCount, sanitizedPostsCount, headers, lastReceivedPostTime, start, mean, lastPostID) {
    const differenceSeconds = (Date.now() - lastReceivedPostTime * 1000) / 1000

    const difference = (Date.now() - start) / 1000

    const averagePosts = getAveragePostsBatchCount()

    console.log(
        'non-sanitized posts count: ',
        postsCount,
        'sanitized posts count: ',
        sanitizedPostsCount,
        '   average posts: ',
        averagePosts,
        "   posts in queue: ",
        getAllSkippedOverPosts().length,
        '   last received post id: ',
        lastPostID,
        '   remaining (out of 100): ',
        headers.get('x-ratelimit-remaining'),
        '   reset: ',
        headers.get('x-ratelimit-reset'),
        '   difference in seconds from last vs now: ',
        differenceSeconds,
        '   fetching time (s): ',
        difference,
        '   mean: ',
        mean
    )
}

// Function that will pause code execution for "ms" amount of time
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
