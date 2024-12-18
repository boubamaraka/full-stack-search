import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../config'; // Import the API_URL from the configuration file
import BackButton from '../components/BackButton';

type Country = {
  _id: string;
  country: string;
  countryisocode: string;
};


const fetchCountry = async (name: string) => {
  const countryData = await fetch(`${API_URL}/countries/${name}`);
  const country = (await countryData.json()) as Country;
  return country;
};

const CountryPage = () => {
  const { name } = useParams<{ name: string }>();
  const [country, setCountry] = useState<Country | null>(null);

  useEffect(() => {
    const getCountry = async () => {
      if (name) {
        const country = await fetchCountry(name);
        setCountry(country);
      }
    };
    getCountry();
  }, [name]);

  if (!country) {
    return <div>Loading...</div>;
  }


  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1>{country.country}</h1>
          <p>ISO Code: {country.countryisocode}</p>
        </div>
      </div>
      <BackButton />
    </div>
  );
};

export default CountryPage;
