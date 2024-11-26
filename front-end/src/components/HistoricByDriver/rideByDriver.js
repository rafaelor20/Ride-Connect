import styled from 'styled-components';

function formateDate(date) {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${hours}:${minutes}  ${day}/${month}/${year}`;
}

export default function RideByDriver(props) {
  const formatedDate = formateDate(props.updatedAt);

  return (
    <RideContainer >
      <p>Id: {props.id}</p>
      <p>Date: {formatedDate}</p>
      <p>Origin: {props.origin}</p>
      <p>Destination: {props.destinationId}</p>
      <p>Distance: {props.distanceInKm}</p>
      <p>Duration: {props.durationInSec}</p>
      <p>Driver id: {props.driverId}</p>
      <p>Driver name: {props.driver.name}</p>
      <p>Value: {props.valueInCents}</p>
    </RideContainer>
  );
}

const RideContainer = styled.div`
  text-align: left;
  min-width: 260px;
  border: 1px solid black;
  margin: 2px;
  padding: 5px;
  p{
    font-size: 14px;
  }
`;

