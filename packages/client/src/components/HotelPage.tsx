import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../config'; // Import the API_URL from the configuration file
import BackButton from '../components/BackButton';
import StatusHandler from '../components/StatusHandler';

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

const fetchHotel = async (id: string): Promise<Hotel> => {
  try {
    const hotelData = await fetch(`${API_URL}/hotels/${id}`);
    if (!hotelData.ok) {
      throw new Error('Failed to fetch hotel data');
    }
    const hotel = (await hotelData.json()) as Hotel;
    return hotel;
  } catch (error) {
    console.error('Error fetching hotel:', error);
    throw error;
  }
};

const HotelPage = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getHotel = async () => {
      try {
        if (id) {
          const hotel = await fetchHotel(id);
          setHotel(hotel);
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
    getHotel();
  }, [id]);

  return (
    <StatusHandler loading={loading} error={error} data={hotel} notFoundMessage="Hotel not found">
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h1>{hotel?.hotel_name}</h1>
            <p>{hotel?.chain_name}</p>
          </div>
          <div className="card-body">
            <p><strong>Address:</strong> {hotel?.addressline1} {hotel?.addressline2}</p>
            <p><strong>City:</strong> {hotel?.city}</p>
            <p><strong>State:</strong> {hotel?.state}</p>
            <p><strong>Zip Code:</strong> {hotel?.zipcode}</p>
            <p><strong>Country:</strong> {hotel?.country} ({hotel?.countryisocode})</p>
            <p><strong>Star Rating:</strong> {hotel?.star_rating}</p>
          </div>
        </div>
        <BackButton />
      </div>
    </StatusHandler>
  );
};

export default HotelPage;
