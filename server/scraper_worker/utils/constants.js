import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// These lines help resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from parent directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') })


// --------- ENV variables
export const WORKER_THING_TYPE = process.env.REDDIT_WORKER_THING_TYPE
export const port = process.env.PORT


// --------- Reddit APIs
export const redditAPIs = {
    allPosts: 'https://oauth.reddit.com/r/all/new/.json',
    allComments: 'https://oauth.reddit.com/r/all/comments/.json',
    info: 'https://oauth.reddit.com/api/info.json',
}

// --------- Constant values
export const CONSTANTS = {
    POSTS_PER_BATCH: 100,
    DELAY_BETWEEN_REQUESTS: 1000 * 1 * 6,
    REQUESTS_ERROR_DELAY: 1000 * 1 * 60,
    MAX_POST_BATCH_COUNT_ARRAY: 5,
    MIN_POSTS_PER_BATCH: 80,
    // seconds delay between last fetched posts and now
    MAX_DELAY_NOW_VS_LAST_POST: 20,
    MAX_DELAY_NOW_VS_LAST_COMMENT: 20,
}

// --------- User agents. Ideally we should switch among them every now and then, we do so every 1000 requests right now
export const USER_AGENTS = [
    'macos:www.digreddit.net:v1.0.0 (by /u/Hot-Glass8919)',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_0; like Mac OS X) AppleWebKit/536.50 (KHTML, like Gecko)  Chrome/49.0.3802.298 Mobile Safari/602.9',
    'Mozilla/5.0 (Linux; U; Linux x86_64; en-US) Gecko/20100101 Firefox/70.3',
    'Mozilla/5.0 (Windows; U; Windows NT 10.3;; en-US) AppleWebKit/600.30 (KHTML, like Gecko) Chrome/53.0.2336.373 Safari/535.8 Edge/14.56048',
    'Mozilla/5.0 (U; Linux i583 x86_64; en-US) Gecko/20100101 Firefox/71.6',
    'Mozilla/5.0 (compatible; MSIE 11.0; Windows; Windows NT 6.3;; en-US Trident/7.0)',
    'Mozilla/5.0 (Windows; U; Windows NT 10.5; x64) Gecko/20100101 Firefox/74.1',
    'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_8_9) AppleWebKit/533.38 (KHTML, like Gecko) Chrome/50.0.3287.302 Safari/535',
    'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_2_5; en-US) AppleWebKit/602.3 (KHTML, like Gecko) Chrome/53.0.1672.381 Safari/537',
    'Dalvik/1.6.0 (Linux; U; Android 4.4.2; EVERCOSS_A74A Build/KOT49H)',
    'Mozilla/5.0 (Linux; Android 9; ANE-LX1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 11; SM-F926U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36',
    'Dalvik/2.1.0 (Linux; U; Android 6.0; EXTREME 7 Build/MRA58K)',
    'Mozilla/5.0 (Linux; Android 5.1.1; Lenovo A2020a40) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 11; SM-N986U1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; U; Android 11; id-id; Redmi Note 9 Build/RP1A.200720.011) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.116 Mobile Safari/537.36 XiaoMi/MiuiBrowser/12.13.0-gn',
    'Mozilla/5.0 (Linux; Android 6.0.1; LG-K220) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.101 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 10.1; dolphin Build/NRD91N; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.100 Safari/537.36',
    'Dalvik/2.1.0 (Linux; U; Android 5.1.1; AQT80 Build/NKS.00.33.02.04)',
]
