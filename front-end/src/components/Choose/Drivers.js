import Styled from 'styled-components';

import Driver from './Driver';
import { useNavigate } from 'react-router-dom';

function calculateValue(distance, value) {
  distance = distance.split(' ')[0];
  distance = parseFloat(distance);
  value = (distance * value).toFixed(2);
  return value;
}

export default function Drivers() {
  const rideEstimateString = localStorage.getItem('rideEstimate');
  let rideEstimate;
  const navigate = useNavigate();

  try {
    rideEstimate = JSON.parse(rideEstimateString);
  } catch (error) {
    console.error('Failed to parse rideEstimate from localStorage', error);
    rideEstimate = { options: [] }; // Provide a default value to avoid errors
  }

  const submit = (option) => {
    option.value = calculateValue(rideEstimate.distance, option.value);
    localStorage.setItem('rideConfirm', JSON.stringify(option));
    navigate('/confirm');
  };

  return (
    <Content>
      <h1>Drivers:</h1>
      {rideEstimate.options.map((option) => (
        <Driver onClick={() => submit(option)} key={option.id} driver={option}/>
      ))}
    </Content>
  );
}

const Content = Styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  padding: 5px;
`;
