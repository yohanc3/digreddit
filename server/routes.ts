/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import DynamicAhoCorasick from '#services/AhoCorasick'
import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
const WebhookIntake = () => import('#controllers/webhook')

router.post('/webhook/intake', [WebhookIntake, 'intake'])
router.get('/', async ({ response }: HttpContext) => {
    console.log('request went through')

    const aho = DynamicAhoCorasick.getInstance()
    const keys = aho.getKeywords()

    return response.status(200).send({ keywords: keys })
})
