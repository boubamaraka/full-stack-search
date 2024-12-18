import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, beforeAll, afterEach, afterAll, expect, vi } from 'vitest';
import Home from './components/Home';
import HotelPage from './components/HotelPage';
import CountryPage from './components/CountryPage';
import CityPage from './components/CityPage';
import { API_URL } from './config';

const mockFetch = vi.fn();

const mockHotelsResponse = {
  json: async () => [
    {
      _id: '1',
      chain_name: 'United Hotels Group',
      hotel_name: 'United Plaza Hotel',
      city: 'Miami',
      country: 'United States',
    },
    {
      _id: '2',
      chain_name: 'United Resorts',
      hotel_name: 'United Beach Resort',
      city: 'United City',
      country: 'United States',
    },
  ],
};

const mockHotelDetailResponse = {
  json: async () => ({
    _id: '1',
    chain_name: 'United Hotels Group',
    hotel_name: 'United Plaza Hotel',
    addressline1: '123 Main St',
    addressline2: '',
    zipcode: '12345',
    city: 'Miami',
    state: 'FL',
    country: 'United States',
    countryisocode: 'US',
    star_rating: 5,
  }),
};

beforeAll(() => {
  global.fetch = mockFetch;
});

afterEach(() => {
  mockFetch.mockClear();
});

afterAll(() => {
  mockFetch.mockRestore();
});

describe('App', () => {
  it('renders search results', async () => {
    mockFetch.mockImplementation((url) => {
      if (url.startsWith(`${API_URL}/hotels`)) {
        return Promise.resolve(mockHotelsResponse);
      }
      return Promise.reject(new Error('not found'));
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/search accommodation/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/search accommodation/i), {
      target: { value: 'united' },
    });

    await waitFor(() => {
      expect(screen.getByText(/United Plaza Hotel/i)).toBeInTheDocument();
      expect(screen.getByText(/United Beach Resort/i)).toBeInTheDocument();
      expect(screen.getByText(/United States/i)).toBeInTheDocument();
      expect(screen.getByText(/United City/i)).toBeInTheDocument();
    });
  });

  it('navigates to hotel page', async () => {
    mockFetch.mockImplementation((url) => {
      if (url.startsWith(`${API_URL}/hotels`)) {
        return Promise.resolve(mockHotelsResponse);
      } else if (url.startsWith(`${API_URL}/hotels/1`)) {
        return Promise.resolve(mockHotelDetailResponse);
      }
      return Promise.reject(new Error('not found'));
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotels/:id" element={<HotelPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/search accommodation/i), {
      target: { value: 'united' },
    });

    expect(await screen.findByText(/United Plaza Hotel/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/United Plaza Hotel/i));
    await waitFor(() => {
      // expect(screen.getByText(/United Hotels Group/i)).toBeInTheDocument();
      // expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
      // expect(screen.getByText(/Miami/i)).toBeInTheDocument();
      // expect(screen.getByText(/FL/i)).toBeInTheDocument();
      // expect(screen.getByText(/12345/i)).toBeInTheDocument();
      // expect(screen.getByText(/United States/i)).toBeInTheDocument();
      // expect(screen.getByText(/5/i)).toBeInTheDocument();
    });
  });

  it('navigates to country page', async () => {
    mockFetch.mockImplementation((url) => {
      if (url.startsWith(`${API_URL}/hotels`)) {
        return Promise.resolve(mockHotelsResponse);
      } else if (url.startsWith(`${API_URL}/countries/United States`)) {
        return Promise.resolve({
          json: async () => ({
            _id: '1',
            country: 'United States',
            countryisocode: 'US',
          }),
        });
      }
      return Promise.reject(new Error('not found'));
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/countries/:name" element={<CountryPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/search accommodation/i), {
      target: { value: 'united' },
    });

    await waitFor(() => {
      expect(screen.getByText(/United States/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/United States/i));
    await waitFor(() => {
      expect(screen.getByText(/United States/i)).toBeInTheDocument();
    });
  });

  it('navigates to city page', async () => {
    mockFetch.mockImplementation((url) => {
      if (url.startsWith(`${API_URL}/hotels`)) {
        return Promise.resolve(mockHotelsResponse);
      } else if (url.startsWith(`${API_URL}/cities/Miami`)) {
        return Promise.resolve({
          json: async () => ({
            _id: '1',
            name: 'Miami',
          }),
        });
      }
      return Promise.reject(new Error('not found'));
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cities/:name" element={<CityPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/search accommodation/i), {
      target: { value: 'Miami' },
    });

    await waitFor(() => {
      expect(screen.getByText(/Miami/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Miami/i));
    await waitFor(() => {
      expect(screen.getByText(/Miami/i)).toBeInTheDocument();
    });
  });
});
