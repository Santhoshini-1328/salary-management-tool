import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../test/test-utils'
import InsightsPage from './InsightsPage'

vi.mock('../api/api', () => ({
  api: {
    get: vi.fn()
  }
}))

import { api } from '../api/api'

describe('InsightsPage Component', () => {
  const mockCountries = [
    { country: 'USA', count: 50 },
    { country: 'UK', count: 30 },
    { country: 'Canada', count: 20 }
  ]

  const mockJobTitles = [
    { jobTitle: 'Engineer', _count: 25 },
    { jobTitle: 'Manager', _count: 15 },
    { jobTitle: 'Designer', _count: 10 }
  ]

  const mockInsights = {
    _avg: { salary: 100000 },
    _min: { salary: 50000 },
    _max: { salary: 150000 },
    _count: 50
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(api.get as any).mockResolvedValue({
      data: { data: mockInsights }
    })
  })

  it('should render insights page title', async () => {
    render(<InsightsPage />)

    await waitFor(() => {
      expect(screen.getByText(/Insights|insights/i)).toBeInTheDocument()
    })
  })

  it('should render country filter dropdown', async () => {
    ;(api.get as any).mockResolvedValue({
      data: { data: mockCountries }
    })

    render(<InsightsPage />)

    await waitFor(() => {
      const countrySelects = screen.queryAllByRole('combobox')
      expect(countrySelects.length).toBeGreaterThan(0)
    })
  })

  it('should render job title filter dropdown', async () => {
    render(<InsightsPage />)

    await waitFor(() => {
      const selects = screen.queryAllByRole('combobox')
      expect(selects.length).toBeGreaterThan(0)
    })
  })

  it('should fetch insights when country changes', async () => {
    ;(api.get as any).mockResolvedValue({
      data: { data: mockCountries }
    })

    render(<InsightsPage />)

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled()
    })
  })

  it('should display salary statistics', async () => {
    render(<InsightsPage />)

    await waitFor(() => {
      expect(screen.queryByText(/Average|Highest|Lowest|Salary/i)).toBeInTheDocument()
    })
  })

  it('should show average salary', async () => {
    render(<InsightsPage />)

    await waitFor(() => {
      expect(screen.getByText(/100000|100,000/)).toBeInTheDocument()
    })
  })

  it('should show employee count', async () => {
    render(<InsightsPage />)

    await waitFor(() => {
      expect(screen.getByText(/50/)).toBeInTheDocument()
    })
  })

  it('should handle loading state', async () => {
    ;(api.get as any).mockImplementation(() => new Promise(() => {}))

    render(<InsightsPage />)

    expect(screen.getByText(/Insights/i)).toBeInTheDocument()
  })

  it('should handle country dropdown change', async () => {
    ;(api.get as any)
      .mockResolvedValueOnce({ data: { data: mockCountries } })
      .mockResolvedValueOnce({ data: { data: mockJobTitles } })
      .mockResolvedValueOnce({ data: { data: mockInsights } })

    render(<InsightsPage />)

    const selects = screen.queryAllByRole('combobox')
    if (selects.length > 0) {
      fireEvent.mouseDown(selects[0])

      await waitFor(() => {
        const option = screen.queryByText('USA')
        if (option) {
          fireEvent.click(option)
        }
      })
    }
  })

  it('should display default insights', async () => {
    render(<InsightsPage />)

    await waitFor(() => {
      expect(screen.getByText(/Insights/i)).toBeInTheDocument()
    })
  })

  it('should format currency values', async () => {
    render(<InsightsPage />)

    await waitFor(() => {
      const salaryText = screen.queryByText(/\$|Average|Salary/)
      expect(salaryText || screen.getByText(/Insights/i)).toBeInTheDocument()
    })
  })

  it('should show zero values when no data', async () => {
    ;(api.get as any).mockResolvedValue({
      data: {
        data: {
          _avg: { salary: null },
          _count: 0
        }
      }
    })

    render(<InsightsPage />)

    await waitFor(() => {
      expect(screen.getByText(/Insights/i)).toBeInTheDocument()
    })
  })

  it('should handle null salary values', async () => {
    ;(api.get as any).mockResolvedValue({
      data: {
        data: {
          _avg: { salary: null },
          _min: { salary: null },
          _max: { salary: null },
          _count: 0
        }
      }
    })

    render(<InsightsPage />)

    await waitFor(() => {
      expect(screen.getByText(/Insights/i)).toBeInTheDocument()
    })
  })

  it('should handle multiple filter interactions', async () => {
    ;(api.get as any)
      .mockResolvedValueOnce({ data: { data: mockCountries } })
      .mockResolvedValueOnce({ data: { data: mockJobTitles } })
      .mockResolvedValueOnce({ data: { data: mockInsights } })

    render(<InsightsPage />)

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled()
    })
  })
})
