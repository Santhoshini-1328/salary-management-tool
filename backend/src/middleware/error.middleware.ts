import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { HttpError } from '../lib/httpError'

export const errorMiddleware = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(error)

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.errors
    })
  }

  if (error instanceof HttpError) {
    return res.status(error.status).json({
      success: false,
      message: error.message
    })
  }

  // Prisma not found error mapping (P2025)
  if (error?.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: error.message || 'Record not found'
    })
  }

  res.status(500).json({
    success: false,
    message: error?.message || 'Internal Server Error'
  })
}