import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProfilePage from './ProfilePage'

// mock browser APIs
global.fetch = vi.fn()
global.alert = vi.fn()

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  test('renders header and sections', () => {
    render(<ProfilePage />)
    expect(screen.getByText(/My Profile/i)).toBeInTheDocument()
    expect(screen.getByText(/Personal Information/i)).toBeInTheDocument()
    expect(screen.getByText(/Employment Information/i)).toBeInTheDocument()
    expect(screen.getByText(/References/i)).toBeInTheDocument()
  })

  test('loads user data on mount (GET)', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        first_name: 'Chris',
        last_name: 'Hassebroek',
        email: 'Chris@email.com',
      }),
    })

    render(<ProfilePage />)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/renter/profile', { credentials: 'include' })
      // Check that the input fields reflect the fetched data
      expect(screen.getByDisplayValue('Chris')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Hassebroek')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Chris@email.com')).toBeInTheDocument()
    })
  })

  test('updates input fields and triggers POST on save', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    render(<ProfilePage />)

    // Change first name
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } })

    // Click Save
    fireEvent.click(screen.getAllByText(/Save Changes/i)[0]) // first Save button

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/renter/profile', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }))
      expect(alert).toHaveBeenCalledWith('Changes updated!')
    })
  })

  // code to test references
  test('adds and removes references', () => {
    render(<ProfilePage />)

    // Add a reference
    fireEvent.click(screen.getByText(/Add Reference/i))
    expect(screen.getByText(/Remove Reference/i)).toBeInTheDocument()

    // Remove the reference
    fireEvent.click(screen.getByText(/Remove Reference/i))
    expect(screen.queryByText(/Remove Reference/i)).not.toBeInTheDocument()
  })
})