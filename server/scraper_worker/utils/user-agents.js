import { USER_AGENTS } from './constants.js'

let requestsCount = 0
let currentUserAgent = USER_AGENTS[0]

function getRandomUserAgent() {
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
}

export function getCurrentUserAgent() {
    try {
        if (process.env.REDDIT_WORKER_THING_TYPE === 'comments') return USER_AGENTS[0]
        else if (process.env.REDDIT_WORKER_THING_TYPE === 'posts') return USER_AGENTS[0]
        else
            throw new Error(
                "process.env.REDDIT_WORKER_THING_TYPE is neither 'posts' nor 'comments'"
            )
    } catch (e) {
        console.error('Error when getting current user agent: ', e)
    }

    return currentUserAgent
}
