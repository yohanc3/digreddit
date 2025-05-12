/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'
const WebhookIntake = () => import('#controllers/webhook')

router.post('/webhook/intake', [WebhookIntake, 'intake'])
router.get('/', async ({ response }: HttpContext) => {
    console.log('request went through')

    const keywords = (await db.from('Products').select('keywords')).flat()

    return response.status(200).send({ keywords })
})
