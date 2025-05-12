import { HttpContext } from '@adonisjs/core/http'
import { compareEmbeddings } from '../utils/vector_embedding_test.js'
import DynamicAhoCorasick from '#services/AhoCorasick'
export default class UserController {
    // Class properties must use private/public/protected keywords
    private static ahoCorasickInstance: DynamicAhoCorasick | null = null

    // Initialize the AhoCorasick instance when the controller is loaded
    private static async initAhoCorasick() {
        if (!this.ahoCorasickInstance) {
            console.log('Initializing AhoCorasick instance for UserController')

            this.ahoCorasickInstance = await DynamicAhoCorasick.create()

            console.log(
                `Initialized with ${this.ahoCorasickInstance.getKeywords().length} keywords`
            )
        }
        return this.ahoCorasickInstance
    }

    // Get the AhoCorasick instance (creating it if needed)
    private async getAhoCorasick() {
        if (!UserController.ahoCorasickInstance) {
            await UserController.initAhoCorasick()
        }

        return UserController.ahoCorasickInstance
    }

    async intake({ request, response }: HttpContext) {
        const start = Date.now()
        const ahoCorasick = await this.getAhoCorasick()
        console.log('took ', (Date.now() - start) / 1000, 'ms seconds to start the aho corasick')

        if (!ahoCorasick) {
            console.log('aho corasick is null')
            return response.status(500).send({ error: 'Aho Corasick is null' })
        }

        const body = request.body()

        const posts = body.posts

        const now = Date.now()

        const processedScores = (
            await Promise.all(
                posts.map(async (post: any) => {
                    const postBody = post.body.toLowerCase()
                    const postTitle = post.title.toLowerCase()

                    const content = postBody + '\n' + postTitle

                    // matchedKeywords looks like ["reddit lead gen", "lead gen", "asd", "123"]
                    const matchedKeyWords = ahoCorasick
                        .matchInText(content)
                        .map((match: any) => match.keyword)

                    if (matchedKeyWords.length === 0) return

                    const embeddingsComparison = await compareEmbeddings(content)

                    const result = {
                        id: post.id,
                        score: embeddingsComparison,
                        url: post.url,
                        keywords: matchedKeyWords,
                        body: postBody,
                    }

                    return result
                })
            )
        ).filter(Boolean)

        console.log(
            'success, time it took: ',
            (Date.now() - now) / 1000,
            ' seconds',
            processedScores
        )

        return response.status(200).send({ body: 'success', processedScores })
    }
}
