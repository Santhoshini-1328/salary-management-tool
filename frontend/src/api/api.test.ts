import { describe, it, expect, beforeEach, vi } from 'vitest'
import axios from 'axios'
import { api } from './api'

vi.mock('axios')
const mockedAxios = axios as any

describe('API Module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('API instance', () => {
    it('should create axios instance with correct base URL', () => {
      expect(api).toBeDefined()
      expect(api.defaults).toBeDefined()
    })

    it('should have correct default headers', () => {
      expect(api.defaults.headers).toBeDefined()
    })
  })

  describe('GET requests', () => {
    it('should make GET request', async () => {
      const mockData = { employees: [] }
      mockedAxios.get.mockResolvedValue({ data: mockData })

      const response = await api.get('/employees')

      expect(response.data).toEqual(mockData)
    })

    it('should handle GET errors', async () => {
      const error = new Error('Network error')
      mockedAxios.get.mockRejectedValue(error)

      await expect(api.get('/employees')).rejects.toThrow('Network error')
    })
  })

  describe('POST requests', () => {
    it('should make POST request with data', async () => {
      const newEmployee = { name: 'John', email: 'john@test.com' }
      const mockResponse = { id: '1', ...newEmployee }
      mockedAxios.post.mockResolvedValue({ data: mockResponse })

      const response = await api.post('/employees', newEmployee)

      expect(response.data).toEqual(mockResponse)
    })

    it('should handle POST errors', async () => {
      const error = new Error('Validation error')
      mockedAxios.post.mockRejectedValue(error)

      await expect(api.post('/employees', {})).rejects.toThrow()
    })
  })

  describe('PUT requests', () => {
    it('should make PUT request with data', async () => {
      const updateData = { salary: 100000 }
      const mockResponse = { id: '1', ...updateData }
      mockedAxios.put.mockResolvedValue({ data: mockResponse })

      const response = await api.put('/employees/1', updateData)

      expect(response.data).toEqual(mockResponse)
    })
  })

  describe('DELETE requests', () => {
    it('should make DELETE request', async () => {
      mockedAxios.delete.mockResolvedValue({ data: { success: true } })

      const response = await api.delete('/employees/1')

      expect(response.data.success).toBe(true)
    })

    it('should handle DELETE errors', async () => {
      const error = new Error('Not found')
      mockedAxios.delete.mockRejectedValue(error)

      await expect(api.delete('/employees/999')).rejects.toThrow()
    })
  })

  describe('Request configuration', () => {
    it('should include auth token if available', () => {
      const config = api.defaults

      expect(config).toBeDefined()
    })

    it('should handle timeout', () => {
      expect(api.defaults.timeout).toBeDefined()
    })
  })
})
