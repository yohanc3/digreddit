import { HttpContext } from '@adonisjs/core/http'
import DynamicAhoCorasick from '#services/AhoCorasick'
import env from '#start/env'
export default class UserController {
    // Class properties must use private/public/protected keywords
    private static ahoCorasickInstance: DynamicAhoCorasick | null = null

    // Initialize the AhoCorasick instance when the controller is loaded
    private static async initAhoCorasick() {
        if (!this.ahoCorasickInstance) {
            console.log('Initializing AhoCorasick instance for UserController')

            this.ahoCorasickInstance = await DynamicAhoCorasick.create()
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

    /*
    This endpoint is used to intake the contentEntry and isPost boolean from the scraper worker
    It then uses the AhoCorasick instance to match the keywords in the contentEntry
    and returns the keywords that were matched.

    Parameters expected in the request body:
    {
        contentEntry: string,
        isPost: boolean
    }

    
    */
    async intake({ request, response }: HttpContext) {
        const start = Date.now()
        const ahoCorasick = await this.getAhoCorasick()

        if (!ahoCorasick) {
            console.log('aho corasick is null. an error occurred')
            return response.status(500).send({ error: 'Aho Corasick is null' })
        }

        const body = request.body()

        if (!body || !body.contentEntry || body.isPost === undefined || body.isPost === null) {
            console.log('Invalid request body.')
            return response.status(500).send({ error: 'Invalid request body.' })
        }

        const contentEntry = body.contentEntry

        const ahoCorasickMatches = ahoCorasick.matchInText(contentEntry.body)

        const keywords = ahoCorasickMatches.map((match: any) => match.keyword)

        const isPost = body.isPost

        if (keywords.length === 0) {
            console.log('No keywords matched in the contentEntry')
            return response.status(200).send({ message: 'No keywords matched in the contentEntry' })
        }

        const responses = await fetch(env.get('LEAD_EVALUATOR_URL'), {
            method: 'POST',
            body: JSON.stringify({
                post: isPost ? contentEntry : null,
                comment: !isPost ? contentEntry : null,
                isPost: isPost,
                keywords: keywords,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': env.get('LEAD_EVALUATOR_AUTH_KEY'),
            },
        })

        const leadEvaluatorResponse = await responses.json()

        console.log(
            'success, time it took: ',
            (Date.now() - start) / 1000,
            ' seconds. Responses from the lead evaluator: '
        )

        return response.status(200).send({ body: 'success', responses: leadEvaluatorResponse })
    }
}
