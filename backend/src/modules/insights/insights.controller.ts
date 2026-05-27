import { Request, Response } from 'express'

import {
  getCountrySalaryInsights,
  getDashboardMetrics,
  getJobTitleInsights
} from './insights.service'

export const getCountryInsightsController = async (
  req: Request<{ country: string }>,
  res: Response
) => {
  const country = req.params.country

  const insights = await getCountrySalaryInsights(country)

  res.json({
    success: true,
    data: insights
  })
}

export const getJobTitleInsightsController = async (
  req: Request,
  res: Response
) => {
  const country = String(req.query.country)
  const title = String(req.query.title)

  const insights = await getJobTitleInsights(country, title)

  res.json({
    success: true,
    data: insights
  })
}

export const getDashboardMetricsController = async (
  _req: Request,
  res: Response
) => {
  const metrics = await getDashboardMetrics()

  res.json({
    success: true,
    data: metrics
  })
}