import styled from 'styled-components';
import Ride from './ride';

export default function Rides(props) {
  const rides = props.rides;
  return (
    <RideContainer>
      {rides.map((ride, index) => (
        <Ride key={index} {...ride} />
      ))}
    </RideContainer>
  );
}

const RideContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
