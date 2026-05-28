import { prisma } from '../../lib/prisma'
import { HttpError } from '../../lib/httpError'

export const getEmployees = async (
  page: number,
  limit: number,
  search: string
) => {
  if (!Number.isInteger(page) || page < 1) {
    throw new HttpError(400, 'Invalid page number')
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new HttpError(400, 'Invalid limit; must be between 1 and 100')
  }

  const skip = (page - 1) * limit

  const where = {
    OR: [
      {
        fullName: {
          contains: search,
          mode: 'insensitive' as const
        }
      },
      {
        email: {
          contains: search,
          mode: 'insensitive' as const
        }
      }
    ]
  }

  try {
    const [employees, count] = await prisma.$transaction([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.employee.count({ where })
    ])

    return {
      employees,
      count
    }
  } catch (err: any) {
    throw new HttpError(500, err?.message || 'Database error')
  }
}

export const createEmployee = async (data: any) => {
  try {
    return await prisma.employee.create({ data })
  } catch (err: any) {
    throw new HttpError(500, err?.message || 'Database error')
  }
}

export const updateEmployee = async (id: string, data: any) => {
  try {
    return await prisma.employee.update({ where: { id }, data })
  } catch (err: any) {
    // Prisma throws P2025 for not found
    if (err?.code === 'P2025') {
      throw new HttpError(404, 'Employee not found')
    }
    throw new HttpError(500, err?.message || 'Database error')
  }
}

export const deleteEmployee = async (id: string) => {
  try {
    return await prisma.employee.delete({ where: { id } })
  } catch (err: any) {
    if (err?.code === 'P2025') {
      throw new HttpError(404, 'Employee not found')
    }
    throw new HttpError(500, err?.message || 'Database error')
  }
}