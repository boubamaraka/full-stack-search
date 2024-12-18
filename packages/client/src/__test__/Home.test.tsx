import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, beforeAll, afterEach, afterAll, expect, vi } from 'vitest';
import Home from '../components/Home';

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

const testCases = [
  {
    description: 'renders search results for hotels, countries, no match cities',
    searchValue: 'united',
    mockResponse: [
      {
        _id: '1',
        chain_name: 'United Hotels Group',
        hotel_name: 'United Plaza Hotel',
        city: 'New York',
        country: 'United States',
      },
      {
        _id: '2',
        chain_name: 'United Resorts',
        hotel_name: 'United Beach Resort',
        city: 'Miami',
        country: 'United States',
      },
    ],
    expectedResults: {
      hotels: ['United Plaza Hotel', 'United Beach Resort'],
      countries: ['United States'],
      cities: ['No cities matched', 'No cities matched'],
    },
  },
  {
    description: 'renders search results for hotels and no matched countries and cities',
    searchValue: 'united',
    mockResponse: [
      {
        _id: '1',
        chain_name: 'United Hotels Group',
        hotel_name: 'United Plaza Hotel',
        city: 'New York',
        country: 'France',
      },
    ],
    expectedResults: {
      hotels: ['United Plaza Hotel'],
      countries: ['No countries matched'],
      cities: ['No cities matched'],
    },
  },
];

describe('Home', () => {
  testCases.forEach(({ description, searchValue, mockResponse, expectedResults }) => {
    it(description, async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
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
        target: { value: searchValue },
      });

      await waitFor(() => {
        Object.values(expectedResults).flat().forEach(result => {
          expect(screen.getByText(new RegExp(result, 'i'))).toBeInTheDocument();
        });
      });
    });
  });
});
