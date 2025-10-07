import { Router } from 'express'

import { listAnalytics } from '../controllers/analytics.controller'

const router = Router()

router.get('/', listAnalytics)

export const analyticsRouter = router
