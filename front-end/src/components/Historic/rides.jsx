import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import RideCard from './RideCard';

export default function Rides({ rides = [] }) {
  const navigate = useNavigate();

  const handleSelectDriver = (driverId) => {
    localStorage.setItem('driverId', JSON.stringify(driverId));
    navigate('/rides-by-driver');
  };

  return (
    <RidesGrid>
      {rides.map((ride) => (
        <RideCard 
          key={ride.id} 
          ride={ride} 
          onSelectDriver={handleSelectDriver} 
        />
      ))}
    </RidesGrid>
  );
}

const RidesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
`;
