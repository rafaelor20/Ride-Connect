import Styled from 'styled-components';

import Driver from './Driver';
import { useNavigate } from 'react-router-dom';

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

  const submit = async (event) => {

  return (
    <Content>
      <h1>Drivers:</h1>
      {rideEstimate.options.map((option) => (
        <Driver key={option.id} name={option.name} value={rideEstimate.value} />
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