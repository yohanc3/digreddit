import { port } from './constants.js'

export function sendToServer(posts, comments, isPosts) {
    try {
        fetch(`http://localhost:${port || 3000}/webhook/intake`, {
            method: 'POST',
            body: JSON.stringify({ posts, comments, isPosts }),
            headers: {
                'content-type': 'application/json',
            },
        }).catch((e) => {
            console.error('Error caught when sending a batch of posts/comments: ', e.message)
        })
    } catch (e) {
        console.error('Error when sending posts to the server: ', e)
        return { ok: false, body: {} }
    }
}
