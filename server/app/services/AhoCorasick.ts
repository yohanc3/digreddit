import db from '@adonisjs/lucid/services/db'
import { DynamicAhoCorasick as DynamicAhoCorasickModule } from '@monyone/aho-corasick'

export default class DynamicAhoCorasick {
    public static instance: DynamicAhoCorasick
    private matcher: DynamicAhoCorasickModule
    private keywords: string[]

    private constructor() {
        this.matcher = new DynamicAhoCorasickModule([])
        this.keywords = []
    }

    public matchInText(text: string) {
        return this.matcher.matchInText(text.toLowerCase())
    }

    public static getInstance() {
        return this.instance
    }

    public static async addKeywords() {
        if (!this.instance || !this.instance.keywords || this.instance.keywords.length === 0) {
            console.log('No keywords to check against')
            return
        }

        const query = `
                SELECT array_agg(product_keywords.keyword) AS keywords_array
                FROM (
                    SELECT lower(jsonb_array_elements_text(keywords)) AS keyword
                    FROM "Products"
                    WHERE keywords IS NOT NULL
                ) AS product_keywords
                WHERE product_keywords.keyword NOT IN (
                    SELECT unnest(?::text[]) AS keyword
                )
    `
        try {
            // Make sure the parameter is properly passed as an array
            const result = await db.rawQuery(query, [this.instance.keywords])

            // expected output of result.rows: rows:  [ { keywords_array: [ 'yohance', 'lol' ] } ] or [ { keywords_array: null } ]
            const keywordsArray = result.rows[0].keywords_array

            if (!keywordsArray) return

            for (const keyword of keywordsArray) {
                this.instance.matcher.add(keyword)
                this.instance.keywords.push(keyword)
            }
        } catch (e) {
            console.log('Error when adding keywords to our aho corasick: ', e)
        }
    }

    public static async removeKeywords() {
        if (!this.instance || !this.instance.keywords || this.instance.keywords.length === 0) {
            console.log('No keywords to check against')
            return
        }

        try {
            const query = `
                        WITH input_keywords AS (
                            SELECT unnest(?::text[]) AS keyword
                        )
                        SELECT array_agg(input_keywords.keyword) AS keywords_array
                        FROM input_keywords
                        WHERE input_keywords.keyword NOT IN (
                            SELECT DISTINCT lower(jsonb_array_elements_text(keywords)) AS keyword
                            FROM "Products"
                            WHERE keywords IS NOT NULL
                        );
                          `
            /*
            Output example: [{ keywords_array: [ 'estate planning', 'lawyers', 'different keyword' ] }]
            */
            const result = await db.rawQuery(query, [this.instance.keywords])
            let keywordsArray = result.rows[0].keywords_array

            if (!keywordsArray) return

            keywordsArray = keywordsArray.map((keyword: string) => keyword.toLowerCase())

            const deleteSet = new Set(keywordsArray)

            // Delete the keywords not in the database, that are in our AhoCorasick instance
            for (const keyword of keywordsArray) {
                this.instance.matcher.delete(keyword)
            }

            // Filter out the keywords not in the db from the keywords instance.
            this.instance.keywords = this.instance.keywords.filter((word) => !deleteSet.has(word))
        } catch (e) {
            console.error('Error when deleting keywords from aho corasick algo: ', e)
        }
    }

    public static async create() {
        if (!this.instance) {
            this.instance = new DynamicAhoCorasick()
        }

        const DBKeywords: string[] = (await db.from('Products').select('keywords')).flatMap((result) => result.keywords).map((keyword) => keyword.toLowerCase())

        this.instance.matcher = new DynamicAhoCorasickModule(DBKeywords)
        this.instance.keywords = [...DBKeywords]

        console.log('initial keywords: ', DBKeywords)

        // Run the adding and removing keywords from the AhoCora every 5 minutes
        const interval = 60 * 5 * 1000
        console.log(`running adding and removing keywords every ${interval / 60 / 1000} minutes...`)
        setInterval(async () => {
            await this.addKeywords()
            await this.removeKeywords()
        }, interval)

        return this.instance
    }

    public getKeywords() {
        return this.keywords
    }
}
