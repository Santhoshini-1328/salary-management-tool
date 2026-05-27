import { Router } from 'express'

import {
  getCountryInsightsController,
  getDashboardMetricsController,
  getJobTitleInsightsController
} from './insights.controller'

const router = Router()

router.get('/country/:country', getCountryInsightsController)
router.get('/job-title', getJobTitleInsightsController)
router.get('/dashboard', getDashboardMetricsController)

export default router