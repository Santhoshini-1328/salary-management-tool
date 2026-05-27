import { prisma } from '../../lib/prisma'

export const getCountrySalaryInsights = async (country: string) => {
  const result = await prisma.employee.aggregate({
    where: {
      country
    },
    _avg: {
      salary: true
    },
    _min: {
      salary: true
    },
    _max: {
      salary: true
    },
    _count: true
  })

  return result
}

export const getJobTitleInsights = async (
  country: string,
  jobTitle: string
) => {
  return prisma.employee.aggregate({
    where: {
      country,
      jobTitle
    },
    _avg: {
      salary: true
    },
    _count: true
  })
}

export const getDashboardMetrics = async () => {
  const employeesByCountry = await prisma.employee.groupBy({
    by: ['country'],
    _count: true,
    _avg: {
      salary: true
    }
  })

  const highestPayingRoles = await prisma.employee.groupBy({
    by: ['jobTitle'],
    _avg: {
      salary: true
    },
    orderBy: {
      _avg: {
        salary: 'desc'
      }
    },
    take: 5
  })

  return {
    employeesByCountry,
    highestPayingRoles
  }
}