import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// These lines help resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const port = process.env.PORT

export async function sendToServer(posts, comments, isPosts) {
    try {
        const result = await fetch(`http://localhost:${port || 3000}/webhook/intake`, {
            method: 'POST',
            body: JSON.stringify({ posts, comments, isPosts }),
            headers: {
                'content-type': 'application/json',
            },
        })

        const body = await result.json()

        return {
            ok: result.ok,
            body,
        }
    } catch (e) {
        console.error('Error when sending posts to the server: ', e)
        return { ok: false, body: {} }
    }
}
