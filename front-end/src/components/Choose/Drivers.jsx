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
    console.log('Failed to parse ride estimate from localStorage', error);
    rideEstimate = { options: [] }; // Provide a default value to avoid errors
  }

  const submit = (option) => {
    localStorage.setItem('rideConfirm', JSON.stringify(option));
    navigate('/confirm');
  };

  return (
    <Content>
      <h1>Available Drivers:</h1>
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
  overflow-y: auto;
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
  max-height: 100%;
  h1 {
    font-size: 18px;
    margin-bottom: 10px;
    color: black;
  }

  /* Add spacing between Driver elements */
  & > *:not(:last-child) {
    margin-bottom: 5px;
  }

  /* Hide scrollbar for Webkit browsers (Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  scrollbar-color: transparent transparent;
`;
