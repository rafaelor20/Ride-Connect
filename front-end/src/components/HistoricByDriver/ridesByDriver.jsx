import React from 'react';
import styled from 'styled-components';
import RideCard from '../Historic/RideCard';

export default function RidesByDriver({ rides = [], onSelectDriver }) {
  return (
    <RidesGrid>
      {rides.map((ride) => (
        <RideCard 
          key={ride.id} 
          ride={ride} 
          onSelectDriver={onSelectDriver}
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
