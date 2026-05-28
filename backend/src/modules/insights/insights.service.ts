import { prisma } from '../../lib/prisma'
import { HttpError } from '../../lib/httpError'

export const getCountrySalaryInsights = async (country: string) => {
  const c = String(country || '').trim()
  if (!c) throw new HttpError(400, 'Country is required')

  try {
    const result = await prisma.employee.aggregate({
      where: { country: c },
      _avg: { salary: true },
      _min: { salary: true },
      _max: { salary: true },
      _count: true
    })

    return result
  } catch (err: any) {
    throw new HttpError(500, err?.message || 'Database error')
  }
}

export const getJobTitleInsights = async (
  country: string,
  jobTitle: string
) => {
  const c = String(country || '').trim()
  const j = String(jobTitle || '').trim()

  if (!c || !j) throw new HttpError(400, 'country and jobTitle are required')

  try {
    return await prisma.employee.aggregate({
      where: { country: c, jobTitle: j },
      _avg: { salary: true },
      _count: true
    })
  } catch (err: any) {
    throw new HttpError(500, err?.message || 'Database error')
  }
}

export const getDashboardMetrics = async () => {
  try {
    const employeesByCountry = await prisma.employee.groupBy({
      by: ['country'],
      _count: true,
      _avg: { salary: true }
    })

    const employeesByCountryWithCount = employeesByCountry.map((country) => ({
      ...country,
      count: typeof country._count === 'number' ? country._count : ((country._count as any)?._all ?? 0)
    }))

    const highestPayingRoles = await prisma.employee.groupBy({
      by: ['jobTitle'],
      _avg: { salary: true },
      orderBy: { _avg: { salary: 'desc' } },
      take: 5
    })

    const totalEmployees = await prisma.employee.count()
    const avgAggregate = await prisma.employee.aggregate({ _avg: { salary: true } })
    const minMax = await prisma.employee.aggregate({ _min: { salary: true }, _max: { salary: true } })

    const countriesGroup = employeesByCountryWithCount
    const departmentsGroup = await prisma.employee.groupBy({ by: ['department'], _count: true })

    const sortedCountries = [...employeesByCountryWithCount].sort((a, b) => (b._avg.salary ?? 0) - (a._avg.salary ?? 0))
    const highestPayingCountry = sortedCountries[0] ?? null

    return {
      employeesByCountry: employeesByCountryWithCount,
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
  } catch (err: any) {
    throw new HttpError(500, err?.message || 'Database error')
  }
}

export const getCountryCounts = async () => {
  try {
    const employeesByCountry = await prisma.employee.groupBy({ by: ['country'], _count: true })

    return employeesByCountry.map((country) => ({
      country: country.country,
      count: typeof country._count === 'number' ? country._count : ((country._count as any)?._all ?? 0)
    }))
  } catch (err: any) {
    throw new HttpError(500, err?.message || 'Database error')
  }
}
