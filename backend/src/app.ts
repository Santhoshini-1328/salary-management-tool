import express, { Request, Response } from 'express'
import cors from 'cors'

import employeeRoutes from './modules/employee/employee.routes'
import insightsRoutes from './modules/insights/insights.routes'
import { errorMiddleware } from './middleware/error.middleware'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Salary Management API Running' })
})

app.use('/employees', employeeRoutes)
app.use('/insights', insightsRoutes)

app.use(errorMiddleware)

export default app