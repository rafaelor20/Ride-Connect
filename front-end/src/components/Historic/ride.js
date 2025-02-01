import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function formateDate(date) {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${hours}:${minutes}  ${day}/${month}/${year}`;
}

export default function Ride(props) {
  const formatedDate = formateDate(props.updatedAt);
  const navigate = useNavigate();

  const handleNavigate = (id) => {
    localStorage.setItem('driverId', props.driverId);
    navigate('/rides-by-driver');
  };

  return (
    <RideContainer onClick={() => handleNavigate(props.driverId)}>
      <p>Id: {props.id}</p>
      <p>Date: {formatedDate}</p>
      <p>Origin: {props.origin.address}</p>
      <p>Destination: {props.destination.address}</p>
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

