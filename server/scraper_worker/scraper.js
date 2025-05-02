import { fetchInitialPostID, fetchRedditPostByID, getNextPostsBatchIDs } from './posts/posts.js'
import { sanitizePosts } from './utils/raw_data_sanitizer.js'
import { logInfo } from './utils/logger.js'
import { delay } from './utils/logger.js'
import { CONSTANTS } from './utils/constants.js'
import { addPostsBatchCount, addTime } from './utils/request_stats.js'
import { addSkippedOverPosts } from './posts/queue.js'
import { sendToServer } from './utils/sendToServer.js'

async function main() {
    try {

        // Represents the last post fetched, which is usually the most recent post. We use this one
        // to know which id to start on when getting the following 100 post ids
        let lastPostID = await fetchInitialPostID()

        while (true) {
            const start = Date.now()

            const { IDs: nextPostsIDsBatch, queuePosts } = getNextPostsBatchIDs(lastPostID)

            const {
                data: request,
                headers,
                ok,
                status,
            } = await fetchRedditPostByID(nextPostsIDsBatch.join(','))

            // If we hit the request limit, get the rate limit reset and delay the main routine that amount of seconds
            if (status === 429) {
                const rateLimitReset = headers.get('x-ratelimit-reset')

                console.warn(
                    '\nran out of requests...waiting ',
                    rateLimitReset / 1000,
                    ' seconds.\n'
                )

                await delay(Number(rateLimitReset) * 1000)
                continue
            }

            // If for whatever reason the response is not in the 200-299 range, restart the fetching process after a bit
            else if (!ok) {
                console.error(
                    'Error when fetching from id:     ',
                    posts[0].data.id,
                    '   to id: ',
                    posts[postsCounter - 1].data.id
                )
                // Delay the function for 1 minute
                await delay(CONSTANTS.REQUESTS_ERROR_DELAY)
                lastPostID = await fetchInitialPostID()
                continue
            }

            // Contains the total payload of the request response
            const requestData = request.data

            // List of posts
            const posts = requestData.children
            const postsBatchCount = posts.length

            // Hold onto the last post's id
            const lastReceivedPostData = posts[postsBatchCount - 1].data
            const lastReceivedPostID = lastReceivedPostData.id
            const lastReceivedPostTime = lastReceivedPostData.created

            const differenceSeconds = (Date.now() - lastReceivedPostTime * 1000) / 1000

            // If the difference in seconds between the last posts of the last batch and now is greater than
            if (differenceSeconds > CONSTANTS.MAX_DELAY_NOW_VS_LAST_POST) {
                lastPostID = await fetchInitialPostID()
                addSkippedOverPosts(lastReceivedPostID, lastPostID)
            }
            // I could be wrong but I remember sometimes the post id would contain "t3_"
            // but later on it didn't. unsure so we handle both cases just in case
            else if (lastReceivedPostID.includes('_')) {
                lastPostID = lastReceivedPostID.split('_')[1]
            } else {
                lastPostID = lastReceivedPostID
            }

            const sanitizedChildren = sanitizePosts(posts)

            const { ok: requestSuccessful } = await sendToServer(sanitizedChildren, {}, true)

            const meanRequestTime = addTime(start)
            addPostsBatchCount(postsBatchCount - queuePosts)

            logInfo(
                postsBatchCount,
                sanitizedChildren.length,
                headers,
                lastReceivedPostTime,
                start,
                meanRequestTime,
                lastPostID
            )

            // Delay the next api request by the default delay between requests and the average time it takes a request to be fulfilled
            await delay(2000)
        }
    } catch (error) {
        console.error('Error fetching data: ', error)
    }
}

main()
