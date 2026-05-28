/// <reference types="jest" />

import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from './employee.service'

jest.mock('../../lib/prisma', () => ({
  prisma: {
    employee: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    $transaction: jest.fn()
  }
}))

const { prisma } = require('../../lib/prisma')
const mockedPrisma = prisma as any

describe('Employee Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getEmployees', () => {
    const mockEmployees = [
      {
        id: '1',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        country: 'USA',
        jobTitle: 'Engineer',
        department: 'Product',
        salary: 120000,
        createdAt: new Date()
      }
    ]

    it('should return employees with pagination', async () => {
      mockedPrisma.$transaction.mockResolvedValue([mockEmployees, 1])

      const result = await getEmployees(1, 10, 'Jane')

      expect(result).toEqual({
        employees: mockEmployees,
        count: 1
      })
      expect(mockedPrisma.$transaction).toHaveBeenCalled()
    })

    it('should handle pagination correctly', async () => {
      mockedPrisma.$transaction.mockResolvedValue([[], 0])

      await getEmployees(2, 10, '')

      expect(mockedPrisma.$transaction).toHaveBeenCalled()
    })

    it('should filter by search term (name)', async () => {
      mockedPrisma.$transaction.mockResolvedValue([mockEmployees, 1])

      await getEmployees(1, 10, 'Jane')

      expect(mockedPrisma.$transaction).toHaveBeenCalled()
    })

    it('should filter by search term (email)', async () => {
      mockedPrisma.$transaction.mockResolvedValue([mockEmployees, 1])

      await getEmployees(1, 10, 'jane@example.com')

      expect(mockedPrisma.$transaction).toHaveBeenCalled()
    })

    it('should handle empty search', async () => {
      mockedPrisma.$transaction.mockResolvedValue([mockEmployees, 1])

      await getEmployees(1, 10, '')

      expect(mockedPrisma.$transaction).toHaveBeenCalled()
    })

    it('should return empty list when no employees match', async () => {
      mockedPrisma.$transaction.mockResolvedValue([[], 0])

      const result = await getEmployees(1, 10, 'NonExistent')

      expect(result.count).toBe(0)
      expect(result.employees.length).toBe(0)
    })
  })

  describe('createEmployee', () => {
    it('should create a new employee', async () => {
      const newEmployeeData = {
        fullName: 'John Smith',
        email: 'john@example.com',
        country: 'USA',
        jobTitle: 'Manager',
        department: 'Sales',
        salary: 150000
      }

      const createdEmployee = {
        id: '2',
        ...newEmployeeData,
        createdAt: new Date()
      }

      mockedPrisma.employee.create.mockResolvedValue(createdEmployee)

      const result = await createEmployee(newEmployeeData)

      expect(result).toEqual(createdEmployee)
      expect(mockedPrisma.employee.create).toHaveBeenCalledWith({
        data: newEmployeeData
      })
    })

    it('should handle creation errors', async () => {
      mockedPrisma.employee.create.mockRejectedValue(new Error('Database error'))

      await expect(createEmployee({})).rejects.toThrow('Database error')
    })
  })

  describe('updateEmployee', () => {
    it('should update an employee', async () => {
      const updateData = { salary: 160000 }
      const updatedEmployee = {
        id: '1',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        country: 'USA',
        jobTitle: 'Engineer',
        department: 'Product',
        salary: 160000,
        createdAt: new Date()
      }

      mockedPrisma.employee.update.mockResolvedValue(updatedEmployee)

      const result = await updateEmployee('1', updateData)

      expect(result).toEqual(updatedEmployee)
      expect(mockedPrisma.employee.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData
      })
    })

    it('should handle partial updates', async () => {
      mockedPrisma.employee.update.mockResolvedValue({})

      await updateEmployee('1', { jobTitle: 'Senior Engineer' })

      expect(mockedPrisma.employee.update).toHaveBeenCalled()
    })

    it('should handle update errors', async () => {
      mockedPrisma.employee.update.mockRejectedValue(new Error('Not found'))

      await expect(updateEmployee('invalid', {})).rejects.toThrow('Not found')
    })
  })

  describe('deleteEmployee', () => {
    it('should delete an employee', async () => {
      const deletedEmployee = {
        id: '1',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        country: 'USA',
        jobTitle: 'Engineer',
        department: 'Product',
        salary: 120000,
        createdAt: new Date()
      }

      mockedPrisma.employee.delete.mockResolvedValue(deletedEmployee)

      const result = await deleteEmployee('1')

      expect(result).toEqual(deletedEmployee)
      expect(mockedPrisma.employee.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      })
    })

    it('should handle deletion errors', async () => {
      mockedPrisma.employee.delete.mockRejectedValue(new Error('Not found'))

      await expect(deleteEmployee('invalid')).rejects.toThrow('Not found')
    })
  })
})
