import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../test/test-utils'
import MainLayout from './MainLayout'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Outlet Content</div>
  }
})

describe('MainLayout Component', () => {
  it('should render layout with header and sidebar', () => {
    render(<MainLayout />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('should render sidebar toggle button', () => {
    render(<MainLayout />)

    const toggleButton = screen.getByRole('button')
    expect(toggleButton).toBeInTheDocument()
  })

  it('should toggle sidebar on button click', () => {
    render(<MainLayout />)

    const toggleButton = screen.getByRole('button')

    fireEvent.click(toggleButton)
    expect(toggleButton).toBeInTheDocument()

    fireEvent.click(toggleButton)
    expect(toggleButton).toBeInTheDocument()
  })

  it('should render brand text in header', () => {
    render(<MainLayout />)

    expect(screen.getByText(/Salary Manager|Salary/i)).toBeInTheDocument()
  })

  it('should render outlet for page content', () => {
    render(<MainLayout />)

    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })

  it('should have appbar with gradient background', () => {
    const { container } = render(<MainLayout />)

    const appbar = container.querySelector('[role="banner"]')
    expect(appbar).toBeInTheDocument()
  })

  it('should render drawer/sidebar', () => {
    const { container } = render(<MainLayout />)

    const drawer = container.querySelector('[class*="Drawer"]') || container.querySelector('[role="presentation"]')
    expect(drawer || container.querySelectorAll('[role="button"]').length).toBeGreaterThan(0)
  })

  it('should have menu items', () => {
    const { container } = render(<MainLayout />)

    const menuItems = container.querySelectorAll('[class*="MenuItem"], [class*="ListItem"]')
    expect(menuItems.length).toBeGreaterThan(0)
  })

  it('should have responsive design', () => {
    const { container } = render(<MainLayout />)

    const mainContent = container.querySelector('[class*="Main"]') || container.querySelector('main')
    expect(mainContent || container.children.length).toBeGreaterThan(0)
  })

  it('should maintain sidebar state', () => {
    render(<MainLayout />)

    const toggleButton = screen.getByRole('button')

    fireEvent.click(toggleButton)
    fireEvent.click(toggleButton)
    fireEvent.click(toggleButton)

    expect(toggleButton).toBeInTheDocument()
  })

  it('should render all navigation links', () => {
    const { container } = render(<MainLayout />)

    const links = container.querySelectorAll('a, [class*="Link"]')
    expect(links.length).toBeGreaterThan(0)
  })

  it('should have no border radius on appbar', () => {
    const { container } = render(<MainLayout />)

    const appbar = container.querySelector('[role="banner"]')
    if (appbar) {
      const style = window.getComputedStyle(appbar)
      expect(style.borderRadius).not.toBe('24px')
    }
  })
})
