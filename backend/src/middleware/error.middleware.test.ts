/// <reference types="jest" />

import { errorMiddleware } from './error.middleware'

describe('Error Middleware', () => {
  it('should pass through without error', () => {
    const req = {} as any
    const res = {} as any
    const next = jest.fn()

    errorMiddleware(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  it('should handle errors', () => {
    const req = {} as any
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any
    const error = new Error('Test error')
    const next = jest.fn()

    errorMiddleware(error, req, res, next)

    expect(res.status).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalled()
  })

  it('should handle unknown errors', () => {
    const req = {} as any
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any
    const next = jest.fn()

    errorMiddleware('Unknown error', req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
  })

  it('should include error message in response', () => {
    const req = {} as any
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any
    const error = new Error('Custom error')
    const next = jest.fn()

    errorMiddleware(error, req, res, next)

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.any(String)
      })
    )
  })
})
