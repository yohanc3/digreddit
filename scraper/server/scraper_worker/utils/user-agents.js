import { USER_AGENTS } from './constants.js'

let requestsCount = 0
let currentUserAgent = USER_AGENTS[0]

function getRandomUserAgent() {
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
}

export function getCurrentUserAgent() {
    requestsCount++

    if (requestsCount === 1000) {
        currentUserAgent = getRandomUserAgent()
        requestsCount = 0
    }

    return currentUserAgent
}
