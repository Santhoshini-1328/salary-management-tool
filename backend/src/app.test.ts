/// <reference types="jest" />

import request from 'supertest'
import app from './app'

describe('App', () => {
  it('should start the server', () => {
    expect(app).toBeDefined()
  })

  it('should return health check message', async () => {
    const response = await request(app).get('/')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Salary Management API Running')
  })

  it('should have employee routes', async () => {
    const response = await request(app)
      .get('/employees?page=1&limit=10&search=')
      .expect(200)

    expect(response.body).toHaveProperty('success')
  })

  it('should have insights routes', async () => {
    const response = await request(app).get('/insights/dashboard').expect(200)

    expect(response.body).toHaveProperty('success')
  })

  it('should handle 404 errors', async () => {
    const response = await request(app).get('/invalid-route')

    expect(response.status).toBeGreaterThanOrEqual(400)
  })

  it('should handle CORS headers', async () => {
    const response = await request(app)
      .options('/')
      .set('Origin', 'http://localhost:3000')

    expect(response.status).toEqual(204)
  })

  it('should parse JSON requests', async () => {
    const payload = { test: 'data' }

    const response = await request(app)
      .post('/employees')
      .send(payload)

    expect(response.body).toBeDefined()
  })

  it('should handle errors gracefully', async () => {
    const response = await request(app)
      .post('/employees')
      .send({ invalid: 'data' })

    expect(response.status).toBeGreaterThanOrEqual(400)
  })
})
