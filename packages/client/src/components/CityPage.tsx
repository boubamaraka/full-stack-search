import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../config'; // Import the API_URL from the configuration file
import BackButton from '../components/BackButton';
import StatusHandler from '../components/StatusHandler';

type City = {
  _id: string;
  name: string;
};

  const fetchCity = async (name: string): Promise<City> => {
    try {
      const cityData = await fetch(`${API_URL}/cities/${name}`);
      if (!cityData.ok) {
        throw new Error('Failed to fetch city data');
      }
      const city = await cityData.json();
      return city;
    } catch (error) {
      console.error('Error fetching city:', error);
      throw error;
    }
  };

const CityPage = () => {
  const { name } = useParams<{ name: string }>();
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCity = async () => {
      try {
        if (name) {
          const city = await fetchCity(name);
          setCity(city);
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
    getCity();
  }, [name]);

  return (
    <StatusHandler loading={loading} error={error} data={city} notFoundMessage="City not found">
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h1>{city?.name}</h1>
          </div>
        </div>
        <BackButton />
      </div>
    </StatusHandler>
  );
};

export default CityPage;
