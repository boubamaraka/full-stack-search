import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, beforeAll, afterEach, afterAll, expect, vi } from 'vitest';
import CityPage from '../components/CityPage';

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

describe('CityPage', () => {
  it('renders city details and back button', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true, // Response for successful request
      json: async () => ({
        _id: '1',
        name: 'Bangkok',
      }),
    });

    render(
      <MemoryRouter initialEntries={['/cities/Bangkok']}>
        <Routes>
          <Route path="/cities/:name" element={<CityPage />} />
        </Routes>
      </MemoryRouter>
    );

    // check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for the city details to be rendered
    await waitFor(() => {
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
    });

    // check city details
    expect(screen.getByText('Bangkok')).toBeInTheDocument();

    // check back button
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
  });
  
  it('shows error when city is not found', async () => {
    // Mock a 404 response
    mockFetch.mockResolvedValueOnce({
      ok: false,  // false response to indicate an error
      status: 404,
    });

    render(
      <MemoryRouter initialEntries={['/cities/InvalidCity']}>
        <Routes>
          <Route path="/cities/:name" element={<CityPage />} />
        </Routes>
      </MemoryRouter>
    );

    // check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // error message should be displayed
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch city data/i)).toBeInTheDocument();
    });
  });
});
