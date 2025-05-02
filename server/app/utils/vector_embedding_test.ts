import { similarity } from 'ml-distance'
import { pipeline } from '@xenova/transformers'

const ProductDescription =
    'Reddit Lead Scraper is an AI-powered tool that helps you discover high-quality leads in real time by tapping into the full stream of Reddit activity. It continuously ingests every post and comment across Reddit, using smart keyword matching and semantic analysis to surface conversations relevant to your product or service. Just provide a short description of what you offer, and the tool automatically identifies Reddit threads where people are likely expressing interest, pain points, or buying intent related to your niche. No manual browsing, no guesswork — just actionable leads as they happen.'

const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')


async function getEmbedding(text: string) {
    const output = await embedder(text, { pooling: 'mean', normalize: true })
    return output.data // returns a Float32Array
}

const productEmbedded = await getEmbedding(ProductDescription);

export async function compareEmbeddings(text: string) {
    const textEmbedding = await getEmbedding(text)

    // Similarity is from 0-1. Example: 0.6657523532242. So we multiply by 10 to get it in the range 0-10, and we fix it to 1 decimal only.
    const similarityResult =
        Number(Number((similarity.cosine(productEmbedded, textEmbedding) * 10).toFixed(1))) * 10

    // After thorough testing, I found that comparisons between embeddings don't really get beyond 6. If they do,
    // it's an extremely good lead. I ran some tests with deepseek. I had 4 dummy tests and 1 dummy product description. The first dummy post was 100% similar
    // to a dummy product description, second was ~75% similar, 3rd 50%, and 4th 0-10%. Deepseek accurately rated them in the following order : 10, 8, 5, 0.
    // Keep in mind I ran the same query multiple times. Xenova/all-MiniLM-L6-v2 however, rated them in the following order: 5.7, 3.3, 2.5, 0. So pretty similar
    // when making 6 the greatest achievable score.
    //  - Yohance
    const similarityResultOutOf6 = similarityResult / 7

    return similarityResultOutOf6
}