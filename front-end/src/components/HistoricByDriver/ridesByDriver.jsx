import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import RideByDriver from './rideByDriver';

export default function RidesByDriver(props) {
  const rides = props.rides;
  
  return (
    <RideContainer>
      {rides.map((ride, index) => (
        <RideByDriver key={ride.id} {...ride} />
      ))}
    </RideContainer>
  );
}
RidesByDriver.propTypes = {
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
  align-items: center;
  overflow: auto;
  padding: 5px;
`;
