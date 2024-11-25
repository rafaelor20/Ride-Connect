import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Driver from './Driver';

export default function Drivers() {
  const { options } = localStorage.getItem('rideEstimate');
  console.log(options);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    try {
      const ride = {
        origin: options.origin,
        destination: options.destination,
        distance: options.distance,
        duration: options.duration,
        driver: { id: options.driver.id, name: options.driver.name, value: options.value },
      };
      localStorage.setItem('ride', JSON.stringify(ride));
      navigate('/confirm');
    } catch (error) {
      toast('Could not choose a driver!');
    }
  }

  return (
    <div>
      <h1>Drivers:</h1>
      {options.map((option) => (
        <Driver key={option.driver.id} name={option.driver.name} value={option.value} />
      ))}
      <button onClick={submit}>Choose</button>
    </div>
  );
}
