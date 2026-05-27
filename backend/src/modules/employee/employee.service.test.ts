/// <reference types="jest" />

import { getEmployees } from './employee.service'

jest.mock('../../lib/prisma', () => ({
  prisma: {
    employee: {
      findMany: jest.fn(),
      count: jest.fn()
    },
    $transaction: jest.fn()
  }
}))

const { prisma } = require('../../lib/prisma')
const mockedPrisma = prisma as any

describe('employee service', () => {
  beforeEach(() => {
    mockedPrisma.$transaction.mockReset()
  })

  it('returns employees and count for search and pagination', async () => {
    const employees = [
      {
        id: '1',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        country: 'USA',
        jobTitle: 'Engineer',
        department: 'Product',
        salary: 120000
      }
    ]

    mockedPrisma.$transaction.mockResolvedValue([employees, 1])

    const result = await getEmployees(1, 10, 'Jane')

    expect(mockedPrisma.$transaction).toHaveBeenCalled()
    expect(result).toEqual({
      employees,
      count: 1
    })
  })
})
