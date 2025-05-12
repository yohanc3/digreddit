import {
    fetchInitialThingID,
    fetchRedditThingByID,
    getNextThingBatchIDs,
} from './reddit_fetch_helpers/helpers.js'
import { sanitizePosts, sanitizeComments } from './utils/raw_data_sanitizer.js'
import { delay } from './utils/logger.js'
import { CONSTANTS, WORKER_THING_TYPE } from './utils/constants.js'
import { logInfo } from './utils/logger.js'
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

            const { IDs: nextThingsIDsBatch } = getNextThingBatchIDs(lastThingID)

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

            // I could be wrong but I remember sometimes the post id would contain "t3_"
            // but later on it didn't. unsure so we handle both cases just in case
            if (lastReceivedThingID.includes('_')) {
                lastThingID = lastReceivedThingID.split('_')[1]
            } else {
                lastThingID = lastReceivedThingID
            }

            const sanitizedChildren =
                WORKER_THING_TYPE === 'posts' ? sanitizePosts(things) : sanitizeComments(things)

            WORKER_THING_TYPE === 'posts'
                ? sendToServer(sanitizedChildren, {}, true)
                : sendToServer({}, sanitizedChildren, false)

            logInfo(
                thingsBatchCount,
                sanitizedChildren.length,
                headers,
                lastReceivedThingTime,
                start,
                0,
                lastThingID
            )

            // Delay for posts is 1750, for comments 0. Comment creation rate is way bigger than that of posts
            await delay(WORKER_THING_TYPE === 'posts' ? 1750 : 0)
        }
    } catch (error) {
        console.error('Error fetching data: ', error)
    }
}

// Set the session's oauth token before starting the main routine
await setOauthToken()

// await is not 100% needed here btw.
await main()
