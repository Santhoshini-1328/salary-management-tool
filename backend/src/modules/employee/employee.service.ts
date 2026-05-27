import { prisma } from '../../lib/prisma'

export const getEmployees = async (
  page: number,
  limit: number,
  search: string
) => {
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
}

export const createEmployee = async (data: any) => {
  return prisma.employee.create({
    data
  })
}

export const updateEmployee = async (id: string, data: any) => {
  return prisma.employee.update({
    where: { id },
    data
  })
}

export const deleteEmployee = async (id: string) => {
  return prisma.employee.delete({
    where: { id }
  })
}