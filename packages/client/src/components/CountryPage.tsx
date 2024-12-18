import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../config'; // Import the API_URL from the configuration file
import BackButton from '../components/BackButton';
import StatusHandler from '../components/StatusHandler';

type Country = {
  _id: string;
  country: string;
  countryisocode: string;
};

const fetchCountry = async (name: string): Promise<Country> => {
    try {
      const countryData = await fetch(`${API_URL}/countries/${name}`);
      if (!countryData.ok) {
        throw new Error('Failed to fetch country data');
      }
      const country = await countryData.json();
      return country;
    } catch (error) {
      console.error('Error fetching country:', error);
      throw error;
    }
  };

const CountryPage = () => {
  const { name } = useParams<{ name: string }>();
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCountry = async () => {
      try {
        if (name) {
          const country = await fetchCountry(name);
          setCountry(country);
          setError(null); // Clear any previous errors
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    getCountry();
  }, [name]);

  return (
    <StatusHandler loading={loading} error={error} data={country} notFoundMessage="Country not found">
      <div className="container">
        <div className="card">
          <div className="card-header">
            {country && (
              <>
                <h1>{country.country}</h1>
                <p>ISO Code: {country.countryisocode}</p>
              </>
            )}
          </div>
        </div>
        <BackButton />
      </div>
    </StatusHandler>
  );
};

export default CountryPage;
