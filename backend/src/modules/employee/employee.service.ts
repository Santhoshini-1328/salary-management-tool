import { prisma } from '../../lib/prisma'

export const getEmployees = async (
  page: number,
  limit: number,
  search: string
) => {
  const skip = (page - 1) * limit

  return prisma.employee.findMany({
    where: {
      OR: [
        {
          fullName: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          email: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc'
    }
  })
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