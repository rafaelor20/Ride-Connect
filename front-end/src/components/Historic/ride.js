import styled from 'styled-components';

export default function Ride(props) {
  console.log(props);
  return (
    <RideContainer>
      <p>Id: {props.id}</p>
      <p>Date: {props.updatedAt}</p>
      <p>Origin: {props.origin}</p>
      <p>Destination: {props.destinationId}</p>
      <p>Distance: {props.distanceInKm}</p>
      <p>Duration: {props.durationInSec}</p>
      <p>Driver id: {props.driverId}</p>
      <p>Driver name: {props.driverId}</p>
      <p>Value: {props.valueInCents}</p>
    </RideContainer>
  );
}

const RideContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

