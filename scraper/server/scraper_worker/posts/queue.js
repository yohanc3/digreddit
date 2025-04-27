/*
    We have a queue that will keep track of posts we skip over during peak times. 
    During peak times, more than 100 posts are created per 5 seconds. So as a result, we end up 
    lagging behind. A good solution for now is to implement a queue (FIFO) so that at night (when there are about
    50-70 posts created every 5ish seconds) we reduce the batch of posts to 70, and we start to fetch ~30 older posts we
    skipped over during peak times per request.
*/

const skippedPostsIDs = []

function addPosts(startID, endID) {
    const startIDBase10 = parseInt(startID, 36)
    const endIDBase10 = parseInt(endID, 36)

    for (let i = 0; i <= endIDBase10 - startIDBase10; i++) {
        const currentIDBase36 = (startIDBase10 + i).toString(36)
        skippedPostsIDs.push(currentIDBase36)
    }
}

function getPosts(count) {
    let accumulator = ''

    for (let i = 0; i < count; i++) {
        const currentID = skippedPostsIDs.shift()
        accumulator += currentID + ','
    }

    return accumulator
}
