import { getAllSkippedOverThings } from '../fetch/queue.js'
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
    const differenceSeconds = (Date.now() - lastReceivedThingTime * 1000) / 1000

    const difference = (Date.now() - start) / 1000

    const averageThings = getAverageThingsBatchCount()

    console.log(
        'non-sanitized things count: ',
        thingsCount,
        'sanitized things count: ',
        sanitizedThingsCount,
        '   average things: ',
        averageThings,
        '   things in queue: ',
        getAllSkippedOverThings().length,
        '   last received thing id: ',
        lastThingID,
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
