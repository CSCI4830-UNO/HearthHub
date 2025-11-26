import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import OwnerSettingsPage from './OwnerSettingsPage'

// Mock browser APIs
global.fetch = vi.fn()
global.alert = vi.fn()
global.confirm = vi.fn(() => true) // auto-confirm delete
delete window.location
window.location = { href: '' }

describe('OwnerSettingsPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  test('renders header and sections', () => {
    render(<OwnerSettingsPage />)
    expect(screen.getByText(/Settings/i)).toBeInTheDocument()
    expect(screen.getByText(/Profile Information/i)).toBeInTheDocument()
    expect(screen.getByText(/Security/i)).toBeInTheDocument()
    expect(screen.getByText(/Danger Zone/i)).toBeInTheDocument()
  })

  test('loads user data on mount (GET)', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        first_name: 'Chris',
        last_name: 'Hassebroek',
        email: 'Chris@email.com',
        phone_number: '123-456-7890',
      }),
    })

    render(<OwnerSettingsPage />)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/owner/settings',
        { credentials: 'include' }
      )
      expect(screen.getByDisplayValue('Chris')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Hassebroek')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Chris@email.com')).toBeInTheDocument()
      expect(screen.getByDisplayValue('123-456-7890')).toBeInTheDocument()
    })
  })

  test('saves changes with POST', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    render(<OwnerSettingsPage />)

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } })
    fireEvent.click(screen.getByText(/Save Changes/i))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/owner/settings',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })
      )
      expect(alert).toHaveBeenCalledWith('Changes updated!')
    })
  })

  test('deletes account with DELETE', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    render(<OwnerSettingsPage />)
    fireEvent.click(screen.getByText(/Delete Account/i))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/owner/settings',
        { method: 'DELETE', credentials: 'include' }
      )
      expect(alert).toHaveBeenCalledWith('Your account has been deleted.')
      expect(window.location.href).toBe('http://localhost:3000')
    })
  })
})