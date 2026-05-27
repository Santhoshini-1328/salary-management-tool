import { NextFunction, Request, Response } from 'express'

export const errorMiddleware = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(error)

  res.status(500).json({
    success: false,
    message: error.message || 'Internal Server Error'
  })
}