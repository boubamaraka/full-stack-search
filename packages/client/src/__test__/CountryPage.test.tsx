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

    // Verify loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for the country details to be rendered
    await waitFor(() => {
      expect(screen.getByText('Thailand')).toBeInTheDocument();
    });

    // Verify country details
    expect(screen.getByText(/ISO Code: TH/)).toBeInTheDocument();

    // Verify back button
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
  });
});
