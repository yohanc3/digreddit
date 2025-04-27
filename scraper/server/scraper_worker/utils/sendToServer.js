import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// These lines help resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const port = process.env.PORT

export async function sendToServer(posts, comments) {
  const result = await fetch(`http://localhost:${port || 3000}/webhook/intake`, {
    method: 'POST',
    body: {
      posts,
      comments,
    },
  })

  return {
    ok: result.ok,
  }
}
