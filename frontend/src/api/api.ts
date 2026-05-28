import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:5000'
})

// Normalize error messages from the backend so callers can rely on `error.message`
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverMessage = error?.response?.data?.message
    const validationErrors = error?.response?.data?.errors
    const message = serverMessage || (validationErrors ? 'Validation failed' : error.message || 'Network Error')
    const err = new Error(message)
    // attach additional info for UI if present
    ;(err as any).details = validationErrors || null
    return Promise.reject(err)
  }
)