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

  // Global aggregates
  const totalEmployees = await prisma.employee.count()
  const avgAggregate = await prisma.employee.aggregate({ _avg: { salary: true } })
  const minMax = await prisma.employee.aggregate({ _min: { salary: true }, _max: { salary: true } })

  // Distinct counts using groupBy
  const countriesGroup = employeesByCountry
  const departmentsGroup = await prisma.employee.groupBy({ by: ['department'], _count: true })

  // Highest paying country by average salary
  const sortedCountries = [...employeesByCountry].sort((a, b) => (b._avg.salary ?? 0) - (a._avg.salary ?? 0))
  const highestPayingCountry = sortedCountries[0] ?? null

  return {
    employeesByCountry,
    highestPayingRoles,
    totalEmployees,
    averageSalary: avgAggregate._avg.salary ?? null,
    highestSalary: minMax._max.salary ?? null,
    lowestSalary: minMax._min.salary ?? null,
    totalCountries: countriesGroup.length,
    totalDepartments: departmentsGroup.length,
    highestPayingCountry,
    highestPayingRole: highestPayingRoles[0] ?? null
  }
}