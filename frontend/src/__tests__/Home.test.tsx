import { render, screen } from '@testing-library/react'
import Home from '../app/page'
import '@testing-library/jest-dom'

// Mock Next.js navigation for App Router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
}))

describe('Home Page', () => {
  it('renders the home page', () => {
    render(<Home />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Analytics Platform')
    
    const description = screen.getByText('Welcome to the Analytics Platform')
    expect(description).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    expect(() => render(<Home />)).not.toThrow()
  })

  it('has correct page structure', () => {
    render(<Home />)
    
    // Check if main content is present
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })
})