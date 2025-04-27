export function logInfo(postsCounter, headers, lastReceivedPostTime, start, mean) {

    const differenceSeconds = (Date.now() - lastReceivedPostTime * 1000) / 1000

    const difference = (Date.now() - start) / 1000

    console.log(
        'count: ',
        postsCounter,
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
