import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../config'; // Import the API_URL from the configuration file
import BackButton from '../components/BackButton';

type City = {
  _id: string;
  name: string;
};


const fetchCity = async (name: string) => {
  const cityData = await fetch(`${API_URL}/cities/${name}`);
  const city = (await cityData.json()) as City;
  return city;
};

const CityPage = () => {
  const { name } = useParams<{ name: string }>();
  const [city, setCity] = useState<City | null>(null);

  useEffect(() => {
    const getCity = async () => {
      if (name) {
        const city = await fetchCity(name);
        setCity(city);
      }
    };
    getCity();
  }, [name]);

  if (!city) {
    return <div>Loading...</div>;
  }


  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1>{city.name}</h1>
        </div>
      </div>
      <BackButton />
    </div>
  );
};

export default CityPage;
