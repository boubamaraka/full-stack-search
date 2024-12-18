import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { API_URL } from '../config'; // Import the API_URL from the configuration file

type Hotel = { _id: string, chain_name: string; hotel_name: string; city: string; country: string };


const fetchAndFilterHotels = async (value: string) => {
  const hotelsData = await fetch(`${API_URL}/hotels`);
  const hotels = (await hotelsData.json()) as Hotel[];
  const filteredHotels = hotels.filter(
    ({ chain_name, hotel_name, city, country }) =>
      chain_name.toLowerCase().includes(value.toLowerCase()) ||
      hotel_name.toLowerCase().includes(value.toLowerCase()) ||
      city.toLowerCase().includes(value.toLowerCase()) ||
      country.toLowerCase().includes(value.toLowerCase())
  );

  const filteredCountries = Array.from(new Set(hotels
    .map(hotel => hotel.country)
    .filter(country => country.toLowerCase().includes(value.toLowerCase()))));

  const filteredCities = Array.from(new Set(hotels
    .map(hotel => hotel.city)
    .filter(city => city.toLowerCase().includes(value.toLowerCase()))));

  return { filteredHotels, filteredCountries, filteredCities };
}

const Home = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [showClearBtn, setShowClearBtn] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { searchValue: string };
    if (state && state.searchValue) {
      setSearchValue(state.searchValue);
      inputRef.current!.value = state.searchValue;
      fetchData(state.searchValue);
    }
  }, [location.state]);

  const fetchData = async (value: string) => {
    if (value === '') {
      setHotels([]);
      setCountries([]);
      setCities([]);
      setShowClearBtn(false);
      return;
    }

    const { filteredHotels, filteredCountries, filteredCities } = await fetchAndFilterHotels(value);
    setShowClearBtn(true);
    setHotels(filteredHotels);
    setCountries(filteredCountries);
    setCities(filteredCities);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    fetchData(value);
  };

  const clearSearch = () => {
    setHotels([]);
    setCountries([]);
    setCities([]);
    setShowClearBtn(false);
    setSearchValue('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleResultClick = (type: string, name: string) => {
    navigate(`/${type}/${name}`, { state: { searchValue } });
  };

  return (
    <div className="App">
      <div className="container">
        <div className="row height d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="dropdown">
              <div className="form">
                <i className="fa fa-search"></i>
                <input
                  type="text"
                  className="form-control form-input"
                  placeholder="Search accommodation..."
                  onChange={handleInputChange}
                  ref={inputRef}
                />
                {showClearBtn && (
                  <span className="left-pan" onClick={clearSearch}>
                    <i className="fa fa-close"></i>
                  </span>
                )}
              </div>
              {(!!hotels.length || !!countries.length || !!cities.length) && (
                <div className="search-dropdown-menu dropdown-menu w-100 show p-2">
                  <h2>Hotels</h2>
                  {hotels.length ? hotels.map((hotel, index) => (
                    <li key={index} onClick={() => handleResultClick('hotels', hotel._id)}>
                      <Link to={`/hotels/${hotel._id}`} state={{ searchValue }} className="dropdown-item">
                        <i className="fa fa-building mr-2"></i>
                        {hotel.hotel_name}
                      </Link>
                      <hr className="divider" />
                    </li>
                  )) : <p>No hotels matched</p>}
                  <h2>Countries</h2>
                  {countries.length ? countries.map((country, index) => (
                    <li key={index} onClick={() => handleResultClick('countries', country)}>
                      <Link to={`/countries/${country}`} state={{ searchValue }} className="dropdown-item">
                        <i className="fa fa-globe mr-2"></i>
                        {country}
                      </Link>
                      <hr className="divider" />
                    </li>
                  )) : <p>No countries matched</p>}
                  <h2>Cities</h2>
                  {cities.length ? cities.map((city, index) => (
                    <li key={index} onClick={() => handleResultClick('cities', city)}>
                      <Link to={`/cities/${city}`} state={{ searchValue }} className="dropdown-item">
                        <i className="fa fa-map-marker mr-2"></i>
                        {city}
                      </Link>
                      <hr className="divider" />
                    </li>
                  )) : <p>No cities matched</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
