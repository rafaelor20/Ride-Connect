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

  const handleNavigate = () => {
    localStorage.setItem('driverId', props.driverId);
    navigate('/rides-by-driver');
  };

  return (
    <RideContainer onClick={() => handleNavigate(props.driverId)}>
      <p>Date: <h1>{formatedDate}</h1></p>
      <p>Origin: <h1>{props.origin.address}</h1></p>
      <p>Destination: <h1>{props.destination.address}</h1></p>
      <p>Distance: <h1>{props.distanceInKm}</h1></p>
      <p>Duration: <h1>{props.durationInSec}</h1></p>
      <p>Driver name: <h1>{props.driver.name}</h1></p>
      <p>Value: <h1>{props.valueInCents}</h1></p>
    </RideContainer>
  );
}

const RideContainer = styled.div`
  text-align: left;
  width: 260px;
  border: 1px solid black;
  margin: 2px;
  padding: 5px;
  p{
    font-size: 14px;
  }
  h1{
    font-size: 14px;
    font-weight: bold;
  }
  cursor: pointer;
  background-color: white;
  transition: background-color 0.2s;
  &:hover {
    background-color: #dadadad3;
  }
`;

