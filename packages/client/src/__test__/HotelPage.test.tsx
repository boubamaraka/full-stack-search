import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, beforeAll, afterEach, afterAll, expect, vi } from 'vitest';
import HotelPage from '../components/HotelPage';

// Mock fetch API
const mockFetch = vi.fn();

beforeAll(() => {
  global.fetch = mockFetch;
});

afterEach(() => {
  mockFetch.mockClear();
});

afterAll(() => {
  mockFetch.mockRestore();
});

describe('HotelPage', () => {
  it('renders hotel details and back button', async () => {
    mockFetch.mockResolvedValueOnce({
    ok: true, // Response for successful request
      json: async () => ({
        _id: '1',
        chain_name: 'Samed Resorts Group',
        hotel_name: 'Sai Kaew Beach Resort',
        addressline1: 'Adderess Line 1',
        addressline2: '',
        zipcode: '21160',
        city: 'Koh Samet',
        state: 'Rayong',
        country: 'Thailand',
        countryisocode: 'TH',
        star_rating: 4,
      }),
    });

    render(
      <MemoryRouter initialEntries={['/hotels/1']}>
        <Routes>
          <Route path="/hotels/:id" element={<HotelPage />} />
        </Routes>
      </MemoryRouter>
    );

    // check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for the hotel details to be rendered
    await waitFor(() => {
      expect(screen.getByText('Sai Kaew Beach Resort')).toBeInTheDocument();
    });

    // check hotel details
    expect(screen.getByText('Samed Resorts Group')).toBeInTheDocument();
    expect(screen.getByText(/Adderess Line 1/)).toBeInTheDocument();
    expect(screen.getByText(/Koh Samet/)).toBeInTheDocument();
    expect(screen.getByText(/Rayong/)).toBeInTheDocument();
    expect(screen.getByText(/21160/)).toBeInTheDocument();
    expect(screen.getByText(/Thailand/)).toBeInTheDocument();
    expect(screen.getByText(/TH/)).toBeInTheDocument();
    expect(screen.getByText(/4/)).toBeInTheDocument();

    // check back button
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
  });
  
  it('shows error when hotel is not found', async () => {
    mockFetch.mockResolvedValueOnce({
    ok: false, // false response to indicate an error
      json: async () => ({
        _id: '1',
        chain_name: 'Samed Resorts Group',
        hotel_name: 'Sai Kaew Beach Resort',
        addressline1: 'Adderess Line 1',
        addressline2: '',
        zipcode: '21160',
        city: 'Koh Samet',
        state: 'Rayong',
        country: 'Thailand',
        countryisocode: 'TH',
        star_rating: 4,
      }),
    });

    render(
      <MemoryRouter initialEntries={['/hotels/1']}>
        <Routes>
          <Route path="/hotels/:id" element={<HotelPage />} />
        </Routes>
      </MemoryRouter>
    );

    // check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch hotel data/i)).toBeInTheDocument();
    });

  });
});
