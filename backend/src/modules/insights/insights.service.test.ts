/// <reference types="jest" />

import {
  getCountrySalaryInsights,
  getJobTitleInsights,
  getDashboardMetrics,
  getCountryCounts
} from './insights.service'
import { prisma } from '../../lib/prisma'

jest.mock('../../lib/prisma', () => ({
  prisma: {
    employee: {
      aggregate: jest.fn(),
      groupBy: jest.fn(),
      count: jest.fn()
    }
  }
}))

const mockedPrisma = prisma as any

describe('Insights Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCountrySalaryInsights', () => {
    it('should return salary insights for a country', async () => {
      const mockInsights = {
        _avg: { salary: 100000 },
        _min: { salary: 50000 },
        _max: { salary: 150000 },
        _count: 5
      }

      mockedPrisma.employee.aggregate.mockResolvedValue(mockInsights)

      const result = await getCountrySalaryInsights('USA')

      expect(result).toEqual(mockInsights)
      expect(mockedPrisma.employee.aggregate).toHaveBeenCalledWith({
        where: { country: 'USA' },
        _avg: { salary: true },
        _min: { salary: true },
        _max: { salary: true },
        _count: true
      })
    })

    it('should handle no employees in country', async () => {
      mockedPrisma.employee.aggregate.mockResolvedValue({
        _avg: { salary: null },
        _min: { salary: null },
        _max: { salary: null },
        _count: 0
      })

      const result = await getCountrySalaryInsights('InvalidCountry')

      expect(result._count).toBe(0)
    })
  })

  describe('getJobTitleInsights', () => {
    it('should return insights for job title in country', async () => {
      const mockInsights = {
        _avg: { salary: 120000 },
        _count: 3
      }

      mockedPrisma.employee.aggregate.mockResolvedValue(mockInsights)

      const result = await getJobTitleInsights('USA', 'Engineer')

      expect(result).toEqual(mockInsights)
      expect(mockedPrisma.employee.aggregate).toHaveBeenCalledWith({
        where: { country: 'USA', jobTitle: 'Engineer' },
        _avg: { salary: true },
        _count: true
      })
    })

    it('should handle no matching job titles', async () => {
      mockedPrisma.employee.aggregate.mockResolvedValue({
        _avg: { salary: null },
        _count: 0
      })

      const result = await getJobTitleInsights('USA', 'InvalidRole')

      expect(result._count).toBe(0)
    })
  })

  describe('getDashboardMetrics', () => {
    it('should return complete dashboard metrics', async () => {
      mockedPrisma.employee.groupBy
        .mockResolvedValueOnce([
          { country: 'USA', _count: 10, _avg: { salary: 100000 } },
          { country: 'UK', _count: 5, _avg: { salary: 95000 } }
        ])
        .mockResolvedValueOnce([
          { jobTitle: 'Engineer', _avg: { salary: 120000 } }
        ])
        .mockResolvedValueOnce([
          { department: 'IT' },
          { department: 'HR' }
        ])

      mockedPrisma.employee.count.mockResolvedValue(15)
      mockedPrisma.employee.aggregate.mockResolvedValue({
        _avg: { salary: 98000 },
        _min: { salary: 50000 },
        _max: { salary: 150000 }
      })

      const result = await getDashboardMetrics()

      expect(result).toHaveProperty('employeesByCountry')
      expect(result).toHaveProperty('highestPayingRoles')
      expect(result).toHaveProperty('totalEmployees')
      expect(result).toHaveProperty('averageSalary')
      expect(result).toHaveProperty('highestSalary')
      expect(result).toHaveProperty('lowestSalary')
    })

    it('should handle empty database', async () => {
      mockedPrisma.employee.groupBy.mockResolvedValue([])
      mockedPrisma.employee.count.mockResolvedValue(0)
      mockedPrisma.employee.aggregate.mockResolvedValue({
        _avg: { salary: null },
        _min: { salary: null },
        _max: { salary: null }
      })

      const result = await getDashboardMetrics()

      expect(result.totalEmployees).toBe(0)
      expect(result.totalCountries).toBe(0)
    })

    it('should include highest paying country', async () => {
      mockedPrisma.employee.groupBy
        .mockResolvedValueOnce([
          { country: 'USA', _count: 10, _avg: { salary: 100000 } },
          { country: 'UK', _count: 5, _avg: { salary: 95000 } }
        ])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])

      mockedPrisma.employee.count.mockResolvedValue(15)
      mockedPrisma.employee.aggregate.mockResolvedValue({
        _avg: { salary: 98000 },
        _min: { salary: 50000 },
        _max: { salary: 150000 }
      })

      const result = await getDashboardMetrics()

      expect(result.highestPayingCountry).toEqual({
        country: 'USA',
        _count: 10,
        _avg: { salary: 100000 },
        count: 10
      })
    })

    it('should return null for highest paying country when empty', async () => {
      mockedPrisma.employee.groupBy
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])

      mockedPrisma.employee.count.mockResolvedValue(0)
      mockedPrisma.employee.aggregate.mockResolvedValue({
        _avg: { salary: null },
        _min: { salary: null },
        _max: { salary: null }
      })

      const result = await getDashboardMetrics()

      expect(result.highestPayingCountry).toBeNull()
    })
  })

  describe('getCountryCounts', () => {
    it('should return employee counts by country', async () => {
      mockedPrisma.employee.groupBy.mockResolvedValue([
        { country: 'USA', _count: 10 },
        { country: 'UK', _count: 5 },
        { country: 'Canada', _count: 3 }
      ])

      const result = await getCountryCounts()

      expect(result).toHaveLength(3)
      expect(result[0]).toHaveProperty('country', 'USA')
      expect(result[0]).toHaveProperty('count', 10)
    })

    it('should handle countries with _count object', async () => {
      mockedPrisma.employee.groupBy.mockResolvedValue([
        { country: 'USA', _count: { _all: 15 } }
      ])

      const result = await getCountryCounts()

      expect(result[0]?.count).toBe(15)
    })

    it('should handle countries with zero count', async () => {
      mockedPrisma.employee.groupBy.mockResolvedValue([
        { country: 'USA', _count: 0 }
      ])

      const result = await getCountryCounts()

      expect(result[0]?.count).toBe(0)
    })

    it('should handle _count object with zero', async () => {
      mockedPrisma.employee.groupBy.mockResolvedValue([
        { country: 'USA', _count: { _all: 0 } }
      ])

      const result = await getCountryCounts()

      expect(result[0]?.count).toBe(0)
    })

    it('should return empty array if no countries', async () => {
      mockedPrisma.employee.groupBy.mockResolvedValue([])

      const result = await getCountryCounts()

      expect(result).toEqual([])
    })

    it('should handle undefined _count', async () => {
      mockedPrisma.employee.groupBy.mockResolvedValue([
        { country: 'USA', _count: undefined }
      ])

      const result = await getCountryCounts()

      expect(result[0]?.count).toBe(0)
    })
  })
})
