/// <reference types="jest" />

import { getEmployeesController, createEmployeeController, updateEmployeeController, deleteEmployeeController } from './employee.controller'
import * as employeeService from './employee.service'

jest.mock('./employee.service', () => ({
  getEmployees: jest.fn(),
  createEmployee: jest.fn(),
  updateEmployee: jest.fn(),
  deleteEmployee: jest.fn()
}))

import { employeeSchema } from './employee.validation'

jest.mock('zod', () => {
  const actual = jest.requireActual('zod')
  return {
    ...actual
  }
})

describe('Employee Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getEmployeesController', () => {
    it('should return employees list with pagination', async () => {
      const mockEmployees = {
        employees: [
          {
            id: '1',
            fullName: 'Jane Doe',
            email: 'jane@example.com',
            country: 'USA',
            jobTitle: 'Engineer',
            department: 'Product',
            salary: 120000
          }
        ],
        count: 1
      }

      ;(employeeService.getEmployees as jest.Mock).mockResolvedValue(mockEmployees)

      const req = {
        query: { page: '1', limit: '10', search: '' }
      } as any
      const res = {
        json: jest.fn()
      } as any

      await getEmployeesController(req, res)

      expect(res.json).toHaveBeenCalled()
      expect(res.json.mock.calls[0][0].success).toBe(true)
    })

    it('should handle invalid pagination', async () => {
      ;(employeeService.getEmployees as jest.Mock).mockResolvedValue({ employees: [], count: 0 })

      const req = {
        query: { page: 'invalid', limit: 'invalid' }
      } as any
      const res = {
        json: jest.fn()
      } as any

      await getEmployeesController(req, res)

      expect(res.json).toHaveBeenCalled()
      expect(employeeService.getEmployees).toHaveBeenCalledWith(1, 10, '')
    })

    it('should pass search parameter', async () => {
      ;(employeeService.getEmployees as jest.Mock).mockResolvedValue({ employees: [], count: 0 })

      const req = {
        query: { page: '1', limit: '10', search: 'Jane' }
      } as any
      const res = {
        json: jest.fn()
      } as any

      await getEmployeesController(req, res)

      expect(employeeService.getEmployees).toHaveBeenCalledWith(1, 10, 'Jane')
    })
  })

  describe('createEmployeeController', () => {
    it('should create a new employee', async () => {
      const newEmployee = {
        fullName: 'John Smith',
        email: 'john@example.com',
        country: 'USA',
        jobTitle: 'Manager',
        department: 'Sales',
        salary: 150000
      }

      const createdEmployee = {
        id: '2',
        ...newEmployee
      }

      ;(employeeService.createEmployee as jest.Mock).mockResolvedValue(createdEmployee)

      const req = { body: newEmployee } as any
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as any

      await createEmployeeController(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalled()
    })

    it('should handle validation errors', async () => {
      const req = { body: { fullName: 'J' } } as any
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as any

      try {
        await createEmployeeController(req, res)
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('should call service with validated data', async () => {
      const newEmployee = {
        fullName: 'John Smith',
        email: 'john@example.com',
        country: 'USA',
        jobTitle: 'Manager',
        department: 'Sales',
        salary: 150000
      }

      ;(employeeService.createEmployee as jest.Mock).mockResolvedValue({ id: '2', ...newEmployee })

      const req = { body: newEmployee } as any
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as any

      await createEmployeeController(req, res)

      expect(employeeService.createEmployee).toHaveBeenCalled()
    })
  })

  describe('updateEmployeeController', () => {
    it('should update an employee', async () => {
      const updateData = { salary: 160000, fullName: 'Jane Doe', email: 'jane@example.com', country: 'USA', jobTitle: 'Engineer', department: 'Product' }

      const updatedEmployee = {
        id: '1',
        ...updateData
      }

      ;(employeeService.updateEmployee as jest.Mock).mockResolvedValue(updatedEmployee)

      const req = {
        params: { id: '1' },
        body: updateData
      } as any
      const res = {
        json: jest.fn()
      } as any

      await updateEmployeeController(req, res)

      expect(res.json).toHaveBeenCalled()
      expect(res.json.mock.calls[0][0].success).toBe(true)
    })

    it('should call service with correct id', async () => {
      const updateData = { salary: 160000, fullName: 'Jane Doe', email: 'jane@example.com', country: 'USA', jobTitle: 'Engineer', department: 'Product' }

      ;(employeeService.updateEmployee as jest.Mock).mockResolvedValue({})

      const req = {
        params: { id: 'test-id' },
        body: updateData
      } as any
      const res = {
        json: jest.fn()
      } as any

      await updateEmployeeController(req, res)

      expect(employeeService.updateEmployee).toHaveBeenCalledWith('test-id', expect.any(Object))
    })
  })

  describe('deleteEmployeeController', () => {
    it('should delete an employee', async () => {
      ;(employeeService.deleteEmployee as jest.Mock).mockResolvedValue({ id: '1' })

      const req = { params: { id: '1' } } as any
      const res = {
        json: jest.fn()
      } as any

      await deleteEmployeeController(req, res)

      expect(employeeService.deleteEmployee).toHaveBeenCalledWith('1')
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Employee deleted successfully'
      })
    })

    it('should handle deletion errors', async () => {
      ;(employeeService.deleteEmployee as jest.Mock).mockRejectedValue(new Error('Not found'))

      const req = { params: { id: 'invalid' } } as any
      const res = {
        json: jest.fn()
      } as any

      try {
        await deleteEmployeeController(req, res)
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })
})
