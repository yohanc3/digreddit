import { fetchInitialThingID, fetchRedditThingByID, getNextThingBatchIDs } from './fetch/helpers.js'
import { sanitizePosts, sanitizeComments } from './utils/raw_data_sanitizer.js'
import { logInfo } from './utils/logger.js'
import { delay } from './utils/logger.js'
import { CONSTANTS } from './utils/constants.js'
import { addThingsBatchCount, addTime } from './utils/request_stats.js'
import { addSkippedOverThings } from './fetch/queue.js'
import { sendToServer } from './utils/send_to_server.js'
import { registerExitHandler, setOauthToken } from './utils/oauth_token_helper.js'

registerExitHandler()

async function main() {
    try {
        // Represents the last post fetched, which is usually the most recent post. We use this one
        // to know which id to start on when getting the following 100 post ids
        let lastThingID = await fetchInitialThingID()

        while (true) {
            const start = Date.now()

            const { IDs: nextThingsIDsBatch, queueThings } = getNextThingBatchIDs(lastThingID)

            // console.log('next thing batch ids: ', nextThingsIDsBatch)
            // return

            const {
                data: request,
                headers,
                ok,
                status,
            } = await fetchRedditThingByID(nextThingsIDsBatch.join(','))

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
                lastThingID = await fetchInitialThingID()
                continue
            }

            // Contains the total payload of the request response
            const requestData = request.data

            // List of things
            const things = requestData.children
            const thingsBatchCount = things.length

            // Hold onto the last post's id
            const lastReceivedThingData = things[thingsBatchCount - 1].data
            const lastReceivedThingID = lastReceivedThingData.id
            const lastReceivedThingTime = lastReceivedThingData.created

            const differenceSeconds = (Date.now() - lastReceivedThingTime * 1000) / 1000

            const MAX_DELAY_NOW_VS_LAST_THING =
                process.env.REDDIT_WORKER_THING_TYPE === 'posts'
                    ? CONSTANTS.MAX_DELAY_NOW_VS_LAST_POST
                    : CONSTANTS.MAX_DELAY_NOW_VS_LAST_COMMENT

            // If the difference in seconds between the last things of the last batch and now is greater than
            if (differenceSeconds > MAX_DELAY_NOW_VS_LAST_THING) {
                lastThingID = await fetchInitialThingID()
                addSkippedOverThings(lastReceivedThingID, lastThingID)
            }
            // I could be wrong but I remember sometimes the post id would contain "t3_"
            // but later on it didn't. unsure so we handle both cases just in case
            else if (lastReceivedThingID.includes('_')) {
                lastThingID = lastReceivedThingID.split('_')[1]
            } else {
                lastThingID = lastReceivedThingID
            }

            const sanitizedChildren =
                process.env.REDDIT_WORKER_THING_TYPE === 'posts'
                    ? sanitizePosts(things)
                    : sanitizeComments(things)

            const { ok: requestSuccessful } =
                process.env.REDDIT_WORKER_THING_TYPE === 'posts'
                    ? await sendToServer(sanitizedChildren, {}, true)
                    : await sendToServer({}, sanitizedChildren, false)

            const meanRequestTime = addTime(start)
            addThingsBatchCount(thingsBatchCount - queueThings)

            logInfo(
                thingsBatchCount,
                sanitizedChildren.length,
                headers,
                lastReceivedThingTime,
                start,
                meanRequestTime,
                lastThingID
            )

            // Delay the next api request by the default delay between requests and the average time it takes a request to be fulfilled
            await delay(2000)
        }
    } catch (error) {
        console.error('Error fetching data: ', error)
    }
}

await setOauthToken()
await main()
