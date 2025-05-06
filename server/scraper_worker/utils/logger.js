import { getAllSkippedOverThings } from '../reddit_fetch_helpers/queue.js'
import { getAverageThingsBatchCount } from './request_stats.js'

export function logInfo(
    thingsCount,
    sanitizedThingsCount,
    headers,
    lastReceivedThingTime,
    start,
    mean,
    lastThingID
) {
    //
    const lastThingCreatedVsNow = (Date.now() - lastReceivedThingTime * 1000) / 1000

    const cycleTime = (Date.now() - start) / 1000

    console.log(
        'non-sanitized things count: ',
        thingsCount,
        'sanitized things count: ',
        sanitizedThingsCount,
        '   last received thing id: ',
        lastThingID,
        '   remaining (out of 100): ',
        headers.get('x-ratelimit-remaining'),
        '   reset: ',
        headers.get('x-ratelimit-reset'),
        '   difference in seconds from last vs now: ',
        lastThingCreatedVsNow,
        '   fetching time (s): ',
        cycleTime
    )
}

// Function that will pause code execution for "ms" amount of time
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
