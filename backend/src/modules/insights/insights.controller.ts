import { Request, Response, NextFunction } from 'express'

import {
  getCountrySalaryInsights,
  getDashboardMetrics,
  getJobTitleInsights,
  getCountryCounts
} from './insights.service'

export const getCountryInsightsController = async (
  req: Request<{ country: string }> ,
  res: Response,
  next: NextFunction
) => {
  try {
    const country = String(req.params.country || '').trim()
    if (!country) return res.status(400).json({ success: false, message: 'Country is required' })

    const insights = await getCountrySalaryInsights(country)

    res.json({ success: true, data: insights })
  } catch (error) {
    next(error)
  }
}

export const getJobTitleInsightsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const country = String(req.query.country || '').trim()
    const title = String(req.query.title || '').trim()

    if (!country || !title) {
      return res.status(400).json({ success: false, message: 'country and title query parameters are required' })
    }

    const insights = await getJobTitleInsights(country, title)

    res.json({ success: true, data: insights })
  } catch (error) {
    next(error)
  }
}

export const getDashboardMetricsController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const metrics = await getDashboardMetrics()

    res.json({ success: true, data: metrics })
  } catch (error) {
    next(error)
  }
}

export const getCountryCountsController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const countryCounts = await getCountryCounts()

    res.json({ success: true, data: countryCounts })
  } catch (error) {
    next(error)
  }
}