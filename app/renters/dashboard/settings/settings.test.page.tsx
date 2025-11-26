import { render, screen, fireEvent } from '@testing-library/react'
import RenterSettingsPage from './RenterSettingsPage'

// mock browser APIs
global.fetch = vi.fn()
global.alert = vi.fn()
global.confirm = vi.fn(() => true) // auto-confirm for delete
delete window.location
window.location = { href: '' }

describe('RenterSettingsPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  test('renders settings header', () => {
    render(<RenterSettingsPage />)
    expect(screen.getByText(/Settings/i)).toBeInTheDocument()
    expect(screen.getByText(/Manage your account/i)).toBeInTheDocument()
  })

  test('calls DELETE when clicking Delete Account', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    render(<RenterSettingsPage />)
    fireEvent.click(screen.getByText(/Delete Account/i))

    expect(fetch).toHaveBeenCalledWith('/api/renter/profile', {
      method: 'DELETE',
      credentials: 'include',
    })
    expect(alert).toHaveBeenCalledWith('Your account has been deleted.')
    expect(window.location.href).toBe('http://localhost:3000')
  })
})