import { useState, useEffect } from 'react';
import BackButton from './BackButton'; // Import the BackButton component
import { useParams } from 'react-router-dom';
import { API_URL } from '../config'; // Import the API_URL from the configuration file

type Hotel = {
  _id: string;
  chain_name: string;
  hotel_name: string;
  addressline1: string;
  addressline2: string;
  zipcode: string;
  city: string;
  state: string;
  country: string;
  countryisocode: string;
  star_rating: number;
};

const fetchHotel = async (id: string) => {
  const hotelData = await fetch(`${API_URL}/hotels/${id}`);
  const hotel = (await hotelData.json()) as Hotel;
  return hotel;
};

const HotelPage = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    const getHotel = async () => {
      if (id) {
        const hotel = await fetchHotel(id);
        setHotel(hotel);
      }
    };
    getHotel();
  }, [id]);

  if (!hotel) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1>{hotel.hotel_name}</h1>
          <p>{hotel.chain_name}</p>
        </div>
        <div className="card-body">
          <p><strong>Address:</strong> {hotel.addressline1} {hotel.addressline2}</p>
          <p><strong>City:</strong> {hotel.city}</p>
          <p><strong>State:</strong> {hotel.state}</p>
          <p><strong>Zip Code:</strong> {hotel.zipcode}</p>
          <p><strong>Country:</strong> {hotel.country} ({hotel.countryisocode})</p>
          <p><strong>Star Rating:</strong> {hotel.star_rating}</p>
        </div>
      </div>
      <BackButton />
    </div>
  );
};

export default HotelPage;
