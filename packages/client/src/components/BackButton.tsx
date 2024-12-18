import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    const state = location.state as { searchValue: string };
    navigate('/', { state: { searchValue: state.searchValue } });
  };

  return (
    <button className="back-button" onClick={handleBackClick}>
      Go Back
    </button>
  );
};

export default BackButton;
