import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, beforeAll, afterEach, afterAll, expect, vi } from 'vitest';
import CountryPage from '../components/CountryPage';

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

describe('CountryPage', () => {
  it('renders country details and back button', async () => {
    mockFetch.mockResolvedValueOnce({
    ok: true, // Response for successful request
    json: async () => ({
        _id: '1',
        country: 'Thailand',
        countryisocode: 'TH',
    }),
    });

    render(
      <MemoryRouter initialEntries={['/countries/Thailand']}>
        <Routes>
          <Route path="/countries/:name" element={<CountryPage />} />
        </Routes>
      </MemoryRouter>
    );

    // check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for the country details to be rendered
    await waitFor(() => {
      expect(screen.getByText('Thailand')).toBeInTheDocument();
    });

    // check country details
    expect(screen.getByText(/ISO Code: TH/)).toBeInTheDocument();

    // check back button
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
  });
  
  it('shows error when country is not found', async () => {
    // Mock a 404 response
    mockFetch.mockResolvedValueOnce({
      ok: false, // false response to indicate an error
      status: 404,
      json: async () => ({ message: 'Country not found' }),
    });

    render(
      <MemoryRouter initialEntries={['/countries/InvalidCountry']}>
        <Routes>
          <Route path="/countries/:name" element={<CountryPage />} />
        </Routes>
      </MemoryRouter>
    );

    // check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch country data/i)).toBeInTheDocument();
    });
  });
  
});
