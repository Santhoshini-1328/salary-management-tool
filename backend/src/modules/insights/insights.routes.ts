import { Router } from 'express'

import {
  getCountryInsightsController,
  getDashboardMetricsController,
  getJobTitleInsightsController,
  getCountryCountsController
} from './insights.controller'

const router = Router()

router.get('/country/:country', getCountryInsightsController)
router.get('/job-title', getJobTitleInsightsController)
router.get('/dashboard', getDashboardMetricsController)
router.get('/country-counts', getCountryCountsController)

export default router