import { Router } from 'express'

import {
  createEmployeeController,
  deleteEmployeeController,
  getEmployeesController,
  updateEmployeeController
} from './employee.controller'

const router = Router()

router.get('/', getEmployeesController)
router.post('/', createEmployeeController)
router.put('/:id', updateEmployeeController)
router.delete('/:id', deleteEmployeeController)

export default router