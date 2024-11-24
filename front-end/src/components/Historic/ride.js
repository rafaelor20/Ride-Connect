import styled from 'styled-components';

export default function Ride(props) {
  const ride = props.ride;
  return (
    <RideContainer>
      <p>Id: {ride.id}</p>
      <p>Date: {ride.date}</p>
      <p>Origin: {ride.origin}</p>
      <p>Destination: {ride.destination}</p>
      <p>Distance: {ride.distance}</p>
      <p>Duration: {ride.duration}</p>
      <p>Driver:</p>
      <p>   Id: {ride.driver.id}</p>
      <p>   Name: {ride.driver.name}</p>
      <p>Value: {ride.value}</p>
    </RideContainer>
  );
}

const RideContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

