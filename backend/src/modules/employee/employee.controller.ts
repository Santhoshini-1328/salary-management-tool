import { Request, Response, NextFunction } from 'express'

import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee
} from './employee.service'

import { employeeSchema } from './employee.validation'

export const getEmployeesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = String(req.query.search || '')

    const employees = await getEmployees(page, limit, search)

    res.json({
      success: true,
      data: {
        items: employees.employees,
        count: employees.count
      }
    })
  } catch (error) {
    next(error)
  }
}

export const createEmployeeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = employeeSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: 'Invalid payload', errors: parsed.error.errors })
    }

    const employee = await createEmployee(parsed.data)

    res.status(201).json({
      success: true,
      data: employee
    })
  } catch (error) {
    next(error)
  }
}

export const updateEmployeeController = async (
  req: Request<{ id: string }> ,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = employeeSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: 'Invalid payload', errors: parsed.error.errors })
    }

    const employee = await updateEmployee(req.params.id, parsed.data)

    res.json({
      success: true,
      data: employee
    })
  } catch (error) {
    next(error)
  }
}

export const deleteEmployeeController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteEmployee(req.params.id)

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}