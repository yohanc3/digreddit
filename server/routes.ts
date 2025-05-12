/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const WebhookIntake = () => import('#controllers/webhook')

router.post('/webhook/intake', [WebhookIntake, 'intake'])
