import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Ride from './ride';

export default function Rides(props) {
  const rides = props.rides;
  console.log(rides);
  
  return (
    <RideContainer>
      {rides.map((ride, index) => (
        <Ride key={ride.id} {...ride} />
      ))}
    </RideContainer>
  );
}
Rides.propTypes = {
  rides: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      // add other ride properties here
    })
  ).isRequired,
};

const RideContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
