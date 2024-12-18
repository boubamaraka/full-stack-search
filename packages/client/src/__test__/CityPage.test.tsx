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

    // Verify loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for the city details to be rendered
    await waitFor(() => {
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
    });

    // Verify city details
    expect(screen.getByText('Bangkok')).toBeInTheDocument();

    // Verify back button
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
  });
});
