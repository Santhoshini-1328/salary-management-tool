import { Request, Response } from 'express'

import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee
} from './employee.service'

import { employeeSchema } from './employee.validation'

export const getEmployeesController = async (
  req: Request,
  res: Response
) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const search = String(req.query.search || '')

  const employees = await getEmployees(page, limit, search)

  res.json({
    success: true,
    data: employees
  })
}

export const createEmployeeController = async (
  req: Request,
  res: Response
) => {
  const validatedData = employeeSchema.parse(req.body)

  const employee = await createEmployee(validatedData)

  res.status(201).json({
    success: true,
    data: employee
  })
}

export const updateEmployeeController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const validatedData = employeeSchema.parse(req.body)

  const employee = await updateEmployee(req.params.id, validatedData)

  res.json({
    success: true,
    data: employee
  })
}

export const deleteEmployeeController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  await deleteEmployee(req.params.id)

  res.json({
    success: true,
    message: 'Employee deleted successfully'
  })
}