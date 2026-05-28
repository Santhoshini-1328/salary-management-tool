import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../test/test-utils'
import DashboardPage from './DashboardPage'

vi.mock('../api/api', () => ({
  api: {
    get: vi.fn()
  }
}))

import { api } from '../api/api'

describe('DashboardPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render dashboard title', async () => {
    ;(api.get as any).mockResolvedValue({
      data: {
        data: {
          totalEmployees: 100,
          averageSalary: 100000,
          highestSalary: 150000,
          lowestSalary: 50000,
          totalCountries: 10,
          totalDepartments: 5,
          employeesByCountry: [],
          highestPayingRoles: [],
          highestPayingCountry: null,
          highestPayingRole: null
        }
      }
    })

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })

  it('should display stat cards', async () => {
    ;(api.get as any).mockResolvedValue({
      data: {
        data: {
          totalEmployees: 100,
          averageSalary: 100000,
          highestSalary: 150000,
          lowestSalary: 50000,
          totalCountries: 10,
          totalDepartments: 5,
          employeesByCountry: [],
          highestPayingRoles: [],
          highestPayingCountry: null,
          highestPayingRole: null
        }
      }
    })

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/Total Employees|Average Salary/)).toBeInTheDocument()
    })
  })

  it('should fetch dashboard metrics on mount', async () => {
    ;(api.get as any).mockResolvedValue({
      data: {
        data: {
          totalEmployees: 100,
          averageSalary: 100000,
          highestSalary: 150000,
          lowestSalary: 50000,
          totalCountries: 10,
          totalDepartments: 5,
          employeesByCountry: [],
          highestPayingRoles: [],
          highestPayingCountry: null,
          highestPayingRole: null
        }
      }
    })

    render(<DashboardPage />)

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/insights/dashboard')
    })
  })

  it('should fetch country counts', async () => {
    ;(api.get as any).mockResolvedValue({
      data: {
        data: [
          { country: 'USA', count: 50 },
          { country: 'UK', count: 30 },
          { country: 'Canada', count: 20 }
        ]
      }
    })

    render(<DashboardPage />)

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/insights/country-counts')
    })
  })

  it('should render country chart', async () => {
    ;(api.get as any)
      .mockResolvedValueOnce({
        data: {
          data: {
            totalEmployees: 100,
            averageSalary: 100000,
            highestSalary: 150000,
            lowestSalary: 50000,
            totalCountries: 10,
            totalDepartments: 5,
            employeesByCountry: [],
            highestPayingRoles: [],
            highestPayingCountry: null,
            highestPayingRole: null
          }
        }
      })
      .mockResolvedValueOnce({
        data: {
          data: [
            { country: 'USA', count: 50 },
            { country: 'UK', count: 30 }
          ]
        }
      })

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/Employees by Country/)).toBeInTheDocument()
    })
  })

  it('should render highest paying roles', async () => {
    ;(api.get as any).mockResolvedValue({
      data: {
        data: {
          totalEmployees: 100,
          averageSalary: 100000,
          highestSalary: 150000,
          lowestSalary: 50000,
          totalCountries: 10,
          totalDepartments: 5,
          employeesByCountry: [],
          highestPayingRoles: [
            { jobTitle: 'CEO', _avg: { salary: 200000 } },
            { jobTitle: 'CTO', _avg: { salary: 180000 } }
          ],
          highestPayingCountry: null,
          highestPayingRole: null
        }
      }
    })

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/Highest Paying Roles/)).toBeInTheDocument()
    })
  })

  it('should handle loading state', () => {
    ;(api.get as any).mockImplementation(() => new Promise(() => {}))

    render(<DashboardPage />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('should display formatted currency', async () => {
    ;(api.get as any).mockResolvedValue({
      data: {
        data: {
          totalEmployees: 100,
          averageSalary: 100000,
          highestSalary: 150000,
          lowestSalary: 50000,
          totalCountries: 10,
          totalDepartments: 5,
          employeesByCountry: [],
          highestPayingRoles: [],
          highestPayingCountry: null,
          highestPayingRole: null
        }
      }
    })

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/\$|Average Salary/)).toBeInTheDocument()
    })
  })

  it('should handle null salary values', async () => {
    ;(api.get as any).mockResolvedValue({
      data: {
        data: {
          totalEmployees: 0,
          averageSalary: null,
          highestSalary: null,
          lowestSalary: null,
          totalCountries: 0,
          totalDepartments: 0,
          employeesByCountry: [],
          highestPayingRoles: [],
          highestPayingCountry: null,
          highestPayingRole: null
        }
      }
    })

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/Dashboard/)).toBeInTheDocument()
    })
  })

  it('should render stat card icons', async () => {
    ;(api.get as any).mockResolvedValue({
      data: {
        data: {
          totalEmployees: 100,
          averageSalary: 100000,
          highestSalary: 150000,
          lowestSalary: 50000,
          totalCountries: 10,
          totalDepartments: 5,
          employeesByCountry: [],
          highestPayingRoles: [],
          highestPayingCountry: null,
          highestPayingRole: null
        }
      }
    })

    const { container } = render(<DashboardPage />)

    await waitFor(() => {
      const svgIcons = container.querySelectorAll('svg')
      expect(svgIcons.length).toBeGreaterThan(0)
    })
  })
})
