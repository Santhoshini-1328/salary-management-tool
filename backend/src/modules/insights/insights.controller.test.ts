/// <reference types="jest" />

import {
  getCountryInsightsController,
  getJobTitleInsightsController,
  getDashboardMetricsController,
  getCountryCountsController
} from './insights.controller'
import * as insightsService from './insights.service'

jest.mock('./insights.service', () => ({
  getCountrySalaryInsights: jest.fn(),
  getJobTitleInsights: jest.fn(),
  getDashboardMetrics: jest.fn(),
  getCountryCounts: jest.fn()
}))

describe('Insights Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCountryInsightsController', () => {
    it('should return insights for a country', async () => {
      const mockInsights = {
        _avg: { salary: 100000 },
        _min: { salary: 50000 },
        _max: { salary: 150000 },
        _count: 5
      }

      ;(insightsService.getCountrySalaryInsights as jest.Mock).mockResolvedValue(mockInsights)

      const req = {
        params: { country: 'USA' }
      } as any
      const res = {
        json: jest.fn()
      } as any

      await getCountryInsightsController(req, res)

      expect(insightsService.getCountrySalaryInsights).toHaveBeenCalledWith('USA')
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockInsights
      })
    })

    it('should handle country with no employees', async () => {
      ;(insightsService.getCountrySalaryInsights as jest.Mock).mockResolvedValue({
        _avg: { salary: null },
        _count: 0
      })

      const req = {
        params: { country: 'InvalidCountry' }
      } as any
      const res = {
        json: jest.fn()
      } as any

      await getCountryInsightsController(req, res)

      expect(res.json).toHaveBeenCalled()
    })

    it('should handle errors gracefully', async () => {
      ;(insightsService.getCountrySalaryInsights as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      const req = {
        params: { country: 'USA' }
      } as any
      const res = {
        json: jest.fn()
      } as any

      await expect(
        getCountryInsightsController(req, res)
      ).rejects.toThrow('Database error')
    })
  })

  describe('getJobTitleInsightsController', () => {
    it('should return insights for job title', async () => {
      const mockInsights = {
        _avg: { salary: 120000 },
        _count: 3
      }

      ;(insightsService.getJobTitleInsights as jest.Mock).mockResolvedValue(mockInsights)

      const req = {
        query: { country: 'USA', title: 'Engineer' }
      } as any
      const res = {
        json: jest.fn()
      } as any

      await getJobTitleInsightsController(req, res)

      expect(insightsService.getJobTitleInsights).toHaveBeenCalledWith('USA', 'Engineer')
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockInsights
      })
    })

    it('should handle missing query parameters', async () => {
      ;(insightsService.getJobTitleInsights as jest.Mock).mockResolvedValue({
        _avg: { salary: null },
        _count: 0
      })

      const req = {
        query: {}
      } as any
      const res = {
        json: jest.fn()
      } as any

      await getJobTitleInsightsController(req, res)

      expect(res.json).toHaveBeenCalled()
    })
  })

  describe('getDashboardMetricsController', () => {
    it('should return dashboard metrics', async () => {
      const mockMetrics = {
        employeesByCountry: [],
        highestPayingRoles: [],
        totalEmployees: 100,
        averageSalary: 100000,
        highestSalary: 150000,
        lowestSalary: 50000,
        totalCountries: 10,
        totalDepartments: 5,
        highestPayingCountry: { country: 'USA', _avg: { salary: 110000 } },
        highestPayingRole: { jobTitle: 'Senior Engineer', _avg: { salary: 130000 } }
      }

      ;(insightsService.getDashboardMetrics as jest.Mock).mockResolvedValue(mockMetrics)

      const req = {} as any
      const res = {
        json: jest.fn()
      } as any

      await getDashboardMetricsController(req, res)

      expect(insightsService.getDashboardMetrics).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockMetrics
      })
    })

    it('should handle empty database', async () => {
      const mockMetrics = {
        employeesByCountry: [],
        highestPayingRoles: [],
        totalEmployees: 0,
        averageSalary: null,
        highestSalary: null,
        lowestSalary: null,
        totalCountries: 0,
        totalDepartments: 0
      }

      ;(insightsService.getDashboardMetrics as jest.Mock).mockResolvedValue(mockMetrics)

      const req = {} as any
      const res = {
        json: jest.fn()
      } as any

      await getDashboardMetricsController(req, res)

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockMetrics
      })
    })
  })

  describe('getCountryCountsController', () => {
    it('should return employee counts by country', async () => {
      const mockCountries = [
        { country: 'USA', count: 10 },
        { country: 'UK', count: 5 },
        { country: 'Canada', count: 3 }
      ]

      ;(insightsService.getCountryCounts as jest.Mock).mockResolvedValue(mockCountries)

      const req = {} as any
      const res = {
        json: jest.fn()
      } as any

      await getCountryCountsController(req, res)

      expect(insightsService.getCountryCounts).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCountries
      })
    })

    it('should return empty array when no countries', async () => {
      ;(insightsService.getCountryCounts as jest.Mock).mockResolvedValue([])

      const req = {} as any
      const res = {
        json: jest.fn()
      } as any

      await getCountryCountsController(req, res)

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: []
      })
    })

    it('should handle service errors', async () => {
      ;(insightsService.getCountryCounts as jest.Mock).mockRejectedValue(
        new Error('Service error')
      )

      const req = {} as any
      const res = {
        json: jest.fn()
      } as any

      await expect(
        getCountryCountsController(req, res)
      ).rejects.toThrow('Service error')
    })
  })
})
