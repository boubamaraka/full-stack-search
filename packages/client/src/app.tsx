import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import HotelPage from './components/HotelPage';
import CountryPage from './components/CountryPage';
import CityPage from './components/CityPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hotels/:id" element={<HotelPage />} />
      <Route path="/countries/:name" element={<CountryPage />} />
      <Route path="/cities/:name" element={<CityPage />} />
    </Routes>
  );
};

export default App;
