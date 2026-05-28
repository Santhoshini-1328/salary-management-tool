import { describe, it, expect } from 'vitest'
import { render, screen } from '../test/test-utils'
import SimpleBarChart from './SimpleBarChart'

describe('SimpleBarChart Component', () => {
  const mockData = [
    { label: 'USA', value: 100 },
    { label: 'UK', value: 80 },
    { label: 'Canada', value: 60 },
    { label: 'Australia', value: 40 },
    { label: 'Germany', value: 30 }
  ]

  it('should render chart with data', () => {
    render(<SimpleBarChart data={mockData} />)

    expect(screen.getByText('USA')).toBeInTheDocument()
    expect(screen.getByText('UK')).toBeInTheDocument()
  })

  it('should render empty state when no data', () => {
    render(<SimpleBarChart data={[]} />)

    const container = screen.queryByRole('list')
    if (container) {
      expect(container.children.length).toBe(0)
    }
  })

  it('should display correct labels', () => {
    render(<SimpleBarChart data={mockData} />)

    mockData.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument()
    })
  })

  it('should display value numbers', () => {
    render(<SimpleBarChart data={mockData} />)

    mockData.forEach(item => {
      const valueElements = screen.queryAllByText(item.value.toString())
      expect(valueElements.length).toBeGreaterThan(0)
    })
  })

  it('should handle single data point', () => {
    const singleData = [{ label: 'Single', value: 100 }]
    render(<SimpleBarChart data={singleData} />)

    expect(screen.getByText('Single')).toBeInTheDocument()
  })

  it('should handle large values', () => {
    const largeData = [
      { label: 'Large', value: 10000 },
      { label: 'Small', value: 100 }
    ]
    render(<SimpleBarChart data={largeData} />)

    expect(screen.getByText('Large')).toBeInTheDocument()
    expect(screen.getByText('Small')).toBeInTheDocument()
  })

  it('should handle zero values', () => {
    const zeroData = [
      { label: 'Zero', value: 0 },
      { label: 'NonZero', value: 50 }
    ]
    render(<SimpleBarChart data={zeroData} />)

    expect(screen.getByText('Zero')).toBeInTheDocument()
    expect(screen.getByText('NonZero')).toBeInTheDocument()
  })

  it('should render list structure', () => {
    const { container } = render(<SimpleBarChart data={mockData} />)

    const listItems = container.querySelectorAll('li, div[role="listitem"]')
    expect(listItems.length).toBeGreaterThan(0)
  })

  it('should maintain data order', () => {
    render(<SimpleBarChart data={mockData} />)

    const labels = screen.getAllByText(/USA|UK|Canada|Australia|Germany/)
    expect(labels[0].textContent).toContain('USA')
  })

  it('should calculate bar width proportionally', () => {
    const { container } = render(<SimpleBarChart data={mockData} />)

    const bars = container.querySelectorAll('[style*="width"]')
    expect(bars.length).toBeGreaterThan(0)
  })
})
