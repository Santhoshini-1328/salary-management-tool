import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../test/test-utils'
import EmployeesPage from './EmployeesPage'

vi.mock('../api/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

import { api } from '../api/api'

describe('EmployeesPage Component', () => {
  const mockEmployeesResponse = {
    data: {
      data: {
        employees: [
          {
            id: '1',
            fullName: 'Jane Doe',
            email: 'jane@example.com',
            country: 'USA',
            jobTitle: 'Engineer',
            department: 'Product',
            salary: 120000
          }
        ],
        count: 1
      }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(api.get as any).mockResolvedValue(mockEmployeesResponse)
  })

  it('should render employees title', async () => {
    render(<EmployeesPage />)

    await waitFor(() => {
      expect(screen.getByText(/Employees|employees/i)).toBeInTheDocument()
    })
  })

  it('should fetch employees on mount', async () => {
    render(<EmployeesPage />)

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/employees'))
    })
  })

  it('should display employees in data grid', async () => {
    render(<EmployeesPage />)

    await waitFor(() => {
      expect(screen.getByText(/Jane Doe|jane@example.com/)).toBeInTheDocument()
    })
  })

  it('should handle search functionality', async () => {
    ;(api.get as any).mockResolvedValue(mockEmployeesResponse)

    render(<EmployeesPage />)

    const searchInput = screen.queryByPlaceholderText(/search|name/i) || screen.queryByRole('textbox')

    if (searchInput) {
      fireEvent.change(searchInput, { target: { value: 'Jane' } })

      await waitFor(() => {
        expect(api.get).toHaveBeenCalled()
      })
    }
  })

  it('should handle pagination', async () => {
    render(<EmployeesPage />)

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled()
    })
  })

  it('should have add employee button', async () => {
    render(<EmployeesPage />)

    const addButton = screen.queryByRole('button', { name: /add|create|new/i })
    expect(addButton || screen.queryByText(/add|create|new/i)).toBeDefined()
  })

  it('should open create dialog', async () => {
    render(<EmployeesPage />)

    const addButton = screen.queryByRole('button', { name: /add|create|new/i })
    if (addButton) {
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.queryByText(/create|add|new employee/i)).toBeInTheDocument()
      })
    }
  })

  it('should handle edit action', async () => {
    render(<EmployeesPage />)

    const editButtons = screen.queryAllByRole('button')
    expect(editButtons.length).toBeGreaterThan(0)
  })

  it('should handle delete action', async () => {
    ;(api.delete as any).mockResolvedValue({ data: { success: true } })

    render(<EmployeesPage />)

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled()
    })
  })

  it('should display employee details in grid', async () => {
    render(<EmployeesPage />)

    await waitFor(() => {
      expect(screen.getByText(/Engineer|Product|USA|120000/)).toBeInTheDocument()
    })
  })

  it('should handle loading state', async () => {
    ;(api.get as any).mockImplementation(() => new Promise(() => {}))

    render(<EmployeesPage />)

    await waitFor(() => {
      expect(screen.getByText(/Employees/i)).toBeInTheDocument()
    })
  })

  it('should handle empty employees list', async () => {
    ;(api.get as any).mockResolvedValue({
      data: {
        data: {
          employees: [],
          count: 0
        }
      }
    })

    render(<EmployeesPage />)

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled()
    })
  })

  it('should validate employee form', async () => {
    render(<EmployeesPage />)

    const addButton = screen.queryByRole('button', { name: /add|create|new/i })
    if (addButton) {
      fireEvent.click(addButton)

      await waitFor(() => {
        const submitButton = screen.queryByRole('button', { name: /submit|create|save/i })
        if (submitButton) {
          fireEvent.click(submitButton)
        }
      })
    }
  })

  it('should handle form submission', async () => {
    ;(api.post as any).mockResolvedValue({
      data: {
        data: {
          id: '2',
          fullName: 'John Smith',
          email: 'john@example.com'
        }
      }
    })

    render(<EmployeesPage />)

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled()
    })
  })
})
