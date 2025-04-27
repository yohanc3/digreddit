import { CONSTANTS } from './constants.js'


///--- Average request time tracker ---///

// Array that holds the time it takes for an iteration to take place in the main function
let fetchingTimes = []

// 30 * 60 = 1,800 seconds. 1,800 / delay in seconds between requests = number of requests that take place every 30 minutes)
const REQUESTS_IN_30_MINUTES_NUM = Math.floor(1800 / (CONSTANTS.DELAY_BETWEEN_REQUESTS / 1000))

export function addTime(start) {
    /*
        Adds a new time to fetchingTimes, calculates the new average, and returns it.
    */

    // Restart the fetching time tracker every 30 minutes
    if (fetchingTimes.length > REQUESTS_IN_30_MINUTES_NUM) fetchingTimes = []

    fetchingTimes.push((Date.now() - start) / 1000)

    // Return the current average in seconds of a fetch request to reddit's api
    return fetchingTimes.reduce((sum, value) => sum + value, 0) / fetchingTimes.length
}


///--- Average posts count tracker ---///

// Keeps track of the count of posts in every batch
let postsBatchCount = []

export function addPostsBatchCount(newCount){
    /*
        Helps keep track of how many posts in average are actually being retrieved in the last 30 requests.
        If such average is less than 80, we limit how many posts are being fetched to the current average,
        and we fill in the rest with older posts that we skipped over during peak times.
    */

    // Limit the number of the list to CONSTANTS.MAX_POST_BATCH_COUNT_ARRAY, so when we go over,
    // we restart the average.
    if(postsBatchCount.length > CONSTANTS.MAX_POST_BATCH_COUNT_ARRAY) postsBatchCount = [];

    // Push the count of posts in the last batch
    postsBatchCount.push(newCount);

}

export function getAveragePostsBatchCount(){
    return postsBatchCount.reduce((sum, value) => sum + value, 0) / postsBatchCount.length;
}